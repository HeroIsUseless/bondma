import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MembershipService } from './membership.service';
import { createZipWithLanguageFiles, exportToCSV, exportToJSON, exportToXML, exportToYAML } from 'src/utils/exportTo';
import { parseImportData } from 'src/utils/importFrom';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private membershipService: MembershipService
  ) {}

  async createProject(data: { 
    name: string; 
    teamId: string;
    url: string;
    description?: string;
    languages?: string[];
  }) {
    // Create project first
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        url: data.url,
        description: data.description,
        teamId: data.teamId,
      },
    });

    // Create default production environment
    await this.prisma.environment.create({
      data: {
        name: 'Production',
        type: 'production',
        languages: data.languages ?? [],
        projectId: project.id,
      },
    });

    return project;
  }

  async findProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        environments: {
          include: {
            tokens: true,
          },
        },
      },
    });
  }

  async findProjectsByTeamId(teamId: string) {
    return this.prisma.project.findMany({
      where: { teamId },
    });
  }

  async updateProject(id: string, data: { 
    name?: string;
    description?: string;
    url?: string;
  }) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: string) {
    // First get all environments for this project
    const environments = await this.prisma.environment.findMany({
      where: { projectId: id }
    });
    
    // Delete all tokens for each environment
    for (const env of environments) {
      await this.prisma.token.deleteMany({
        where: { environmentId: env.id }
      });
    }
    
    // Delete all environments
    await this.prisma.environment.deleteMany({
      where: { projectId: id }
    });
    
    // Then delete the project itself
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addLanguage(environmentId: string, language: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId }
    });
    
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    
    // Ensure language array exists and avoid duplicate additions
    const languages = environment.languages || [];
    if (!languages.includes(language)) {
      return this.prisma.environment.update({
        where: { id: environmentId },
        data: {
          languages: [...languages, language]
        }
      });
    }
    
    return environment;
  }

  async removeLanguage(environmentId: string, language: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId }
    });
    
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    
    const languages = environment.languages || [];
    return this.prisma.environment.update({
      where: { id: environmentId },
      data: {
        languages: languages.filter(lang => lang !== language)
      }
    });
  }

  // Check if user has permission to access the project
  async checkUserProjectPermission(projectId: string, userId: string): Promise<boolean> {
    // First get project information to find its team
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { teamId: true }
    });

    if (!project) {
      throw new NotFoundException('Project does not exist');
    }

    // Check if user is a team member
    return this.membershipService.isMember(project.teamId, userId);
  }

  // ============= Token related methods =============

  // Get all tokens in a specific environment
  async getProjectTokens(environmentId: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId }
    });
    
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    
    return this.prisma.token.findMany({
      where: { environmentId }
    });
  }

  // Create new token
  async createToken(data: {
    environmentId: string;
    key: string;
    tags?: string[];
    comment?: string;
    translations?: Record<string, string>;
  }) {
    // Check if environment exists
    const environment = await this.prisma.environment.findUnique({
      where: { id: data.environmentId }
    });
    
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    
    // Check if key already exists in this environment
    const existingToken = await this.prisma.token.findFirst({
      where: {
        environmentId: data.environmentId,
        key: data.key
      }
    });

    if (existingToken) {
      throw new BadRequestException(`Token key '${data.key}' already exists in this environment`);
    }

    // Create token and store translations directly
    return this.prisma.token.create({
      data: {
        environmentId: data.environmentId,
        key: data.key,
        tags: data.tags || [],
        comment: data.comment || '',
        translations: data.translations || {},
      }
    });
  }

  // Get a single token
  async getTokenById(tokenId: string) {
    const token = await this.prisma.token.findUnique({
      where: { id: tokenId }
    });

    if (!token) {
      throw new NotFoundException(`Token ${tokenId} does not exist`);
    }

    return token;
  }

  // Update token
  async updateToken(tokenId: string, data: {
    key?: string;
    tags?: string[];
    comment?: string;
    translations?: Record<string, string>;
  }) {
    // Get token to confirm it exists
    const token = await this.getTokenById(tokenId);

    // If changing key, check for duplicates
    if (data.key && data.key !== token.key) {
      const existingToken = await this.prisma.token.findFirst({
        where: {
          environmentId: token.environmentId,
          key: data.key,
          NOT: { id: tokenId }
        }
      });

      if (existingToken) {
        throw new BadRequestException(`Token key '${data.key}' already exists in this environment`);
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.key !== undefined) updateData.key = data.key;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.comment !== undefined) updateData.comment = data.comment;

    // If translations are provided, merge them rather than completely replacing
    if (data.translations) {
      // Get existing translations from current token
      const currentTranslations = token.translations as Record<string, string> || {};
      
      // Merge new translations
      updateData.translations = {
        ...currentTranslations,
        ...data.translations
      };
    }

    // Execute update
    return this.prisma.token.update({
      where: { id: tokenId },
      data: updateData
    });
  }

  // Delete token
  async deleteToken(tokenId: string) {
    // Get token to confirm it exists
    await this.getTokenById(tokenId);

    // Delete token
    return this.prisma.token.delete({
      where: { id: tokenId }
    });
  }

  // Export project content
  async exportProjectTokens(environmentId: string, options: {
    format: 'json' | 'csv' | 'xml' | 'yaml';
    scope?: 'all' | 'completed' | 'incomplete' | 'custom';
    languages?: string[];
    showEmptyTranslations?: boolean;
    prettify?: boolean;
    includeMetadata?: boolean;
    asZip?: boolean;
  }) {
    // Get environment information for supported language list
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId },
      include: { project: true }
    });
    
    if (!environment) {
      throw new NotFoundException('Environment does not exist');
    }

    // Get all tokens for this environment
    let tokens = await this.prisma.token.findMany({
      where: { environmentId }
    });

    // Filter tokens based on scope
    if (options.scope) {
      tokens = this.filterTokensByScope(tokens, options.scope, environment.languages);
    }

    // If languages are specified, only export translations for these languages
    const targetLanguages = (options.languages && options.languages.length > 0) 
      ? options.languages.filter(lang => environment.languages.includes(lang))
      : environment.languages;

    // Filter based on showEmptyTranslations option
    if (options.showEmptyTranslations === false) {
      tokens = tokens.map(token => {
        const translations = token.translations as Record<string, string> || {};
        const filteredTranslations: Record<string, string> = {};
        
        targetLanguages.forEach(lang => {
          if (translations[lang]) {
            filteredTranslations[lang] = translations[lang];
          }
        });
        
        return {
          ...token,
          translations: filteredTranslations
        };
      });
    } else {
      // Ensure all tokens include all target languages, even if empty
      tokens = tokens.map(token => {
        const translations = token.translations as Record<string, string> || {};
        const completeTranslations: Record<string, string> = {};
        
        targetLanguages.forEach(lang => {
          completeTranslations[lang] = translations[lang] || '';
        });
        
        return {
          ...token,
          translations: completeTranslations
        };
      });
    }

    // Remove unwanted metadata
    if (!options.includeMetadata) {
      // @ts-ignore
      tokens = tokens.map(({ id, environmentId, key, translations }) => ({
        id, environmentId, key, translations
      }));
    }

    // Default export as ZIP (one file per language)
    return await createZipWithLanguageFiles(tokens, environment.project, targetLanguages, options.format, {
      prettify: options.prettify
    });
  }

  // Import project content
  async importProjectTokens(environmentId: string, data: {
    language: string;      // Language to import
    content: string;       // File content
    format: 'json' | 'csv' | 'xml' | 'yaml'; // Import format
    mode: 'append' | 'replace'; // Import mode
  }) {
    // Get environment information
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId }
    });
    
    if (!environment) {
      throw new NotFoundException('Environment does not exist');
    }

    // Verify if language is in environment's supported language list
    if (!environment.languages.includes(data.language)) {
      throw new BadRequestException(`Environment does not support "${data.language}" language`);
    }

    // Parse imported data
    const importData = parseImportData(data.content, data.format);
    
    if (!importData || Object.keys(importData).length === 0) {
      throw new BadRequestException('Imported file does not contain valid data or has incorrect format');
    }

    // Get all current tokens for the environment
    const existingTokens = await this.prisma.token.findMany({
      where: { environmentId }
    });

    // Statistics
    const stats = {
      added: 0,        // Number of new tokens added
      updated: 0,      // Number of tokens updated
      unchanged: 0,    // Number of tokens unchanged
      total: Object.keys(importData).length // Total tokens processed
    };

    // Process data according to import mode
    if (data.mode === 'replace') {
      // Replace mode: first clear all existing translations for this language
      await Promise.all(existingTokens.map(async token => {
        const translations = token.translations as Record<string, string> || {};
        // Delete translation for this language
        delete translations[data.language];
        
        // Update token
        await this.prisma.token.update({
          where: { id: token.id },
          data: { translations }
        });
      }));

      // Then import new data
      for (const key of Object.keys(importData)) {
        const value = importData[key];
        const existingToken = existingTokens.find(t => t.key === key);
        
        if (existingToken) {
          // Update existing token's translation
          const translations = existingToken.translations as Record<string, string> || {};
          translations[data.language] = value;
          
          await this.prisma.token.update({
            where: { id: existingToken.id },
            data: { translations }
          });
          
          stats.updated++;
        } else {
          // Create new token
          const translations: Record<string, string> = {};
          translations[data.language] = value;
          
          await this.prisma.token.create({
            data: {
              environmentId,
              key,
              tags: [],
              comment: '',
              translations
            }
          });
          
          stats.added++;
        }
      }
    } else {
      // Append mode: keep existing translations, only update or add new ones
      for (const key of Object.keys(importData)) {
        const value = importData[key];
        const existingToken = existingTokens.find(t => t.key === key);
        
        if (existingToken) {
          // Get existing translations
          const translations = existingToken.translations as Record<string, string> || {};
          
          // Check if update is needed
          if (translations[data.language] !== value) {
            translations[data.language] = value;
            
            await this.prisma.token.update({
              where: { id: existingToken.id },
              data: { translations }
            });
            
            stats.updated++;
          } else {
            stats.unchanged++;
          }
        } else {
          // Create new token
          const translations: Record<string, string> = {};
          translations[data.language] = value;
          
          await this.prisma.token.create({
            data: {
              environmentId,
              key,
              tags: [],
              comment: '',
              translations
            }
          });
          
          stats.added++;
        }
      }
    }

    return {
      stats,
      message: `Import completed: ${stats.added} added, ${stats.updated} updated, ${stats.unchanged} unchanged`
    };
  }

  // Filter tokens by scope
  private filterTokensByScope(tokens: any[], scope: string, environmentLanguages: string[]) {
    switch (scope) {
      case 'all':
        return tokens;
      case 'completed':
        return tokens.filter(token => {
          const translations = token.translations as Record<string, string> || {};
          return environmentLanguages.every(lang => translations[lang] && translations[lang].trim() !== '');
        });
      case 'incomplete':
        return tokens.filter(token => {
          const translations = token.translations as Record<string, string> || {};
          return environmentLanguages.some(lang => !translations[lang] || translations[lang].trim() === '');
        });
      case 'custom':
        // Custom filter can be extended as needed
        return tokens;
      default:
        return tokens;
    }
  }

  async createEnvironment(projectId: string, data: { 
    name: string;
    type: string;
    description?: string;
    defaultLang?: string;
    languages?: string[];
  }) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project does not exist');
    }

    return this.prisma.environment.create({
      data: {
        name: data.name,
        type: data.type,
        defaultLang: data.defaultLang,
        languages: data.languages || [],
        projectId,
      },
    });
  }

  async deleteEnvironment(projectId: string, environmentId: string) {
    const environment = await this.prisma.environment.findUnique({ where: { id: environmentId } });
    if (!environment || environment.projectId !== projectId) {
      throw new NotFoundException('Environment does not exist or does not belong to the project');
    }

    // First delete all tokens associated with this environment
    await this.prisma.token.deleteMany({
      where: { environmentId: environmentId }
    });

    return this.prisma.environment.delete({ where: { id: environmentId } });
  }

  async updateEnvironment(projectId: string, environmentId: string, data: { 
    name?: string;
    type?: string;
    defaultLang?: string;
    languages?: string[];
  }) {
    const environment = await this.prisma.environment.findUnique({ where: { id: environmentId } });
    if (!environment || environment.projectId !== projectId) {
      throw new NotFoundException('Environment does not exist or does not belong to the project');
    }

    return this.prisma.environment.update({
      where: { id: environmentId },
      data,
    });
  }

  async listEnvironments(projectId: string) {
    return this.prisma.environment.findMany({ where: { projectId } });
  }
}