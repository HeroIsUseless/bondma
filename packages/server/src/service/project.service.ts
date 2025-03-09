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
    return this.prisma.project.create({
      data: {
        ...data,
        languages: data.languages || [],  // Use provided languages or default to empty array
      },
    });
  }

  async findAllProjects() {
    return this.prisma.project.findMany();
  }

  async findProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        tokens: true, // Include all tokens
      }
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
    languages?: string[];
  }) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: string) {
    // First delete all tokens associated with this project
    await this.prisma.token.deleteMany({
      where: { projectId: id }
    });
    
    // Then delete the project itself
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addLanguage(id: string, language: string) {
    const project = await this.prisma.project.findUnique({
      where: { id }
    });
    
    // Ensure language array exists and avoid duplicate additions
    const languages = project?.languages || [];
    if (!languages.includes(language)) {
      return this.prisma.project.update({
        where: { id },
        data: {
          languages: [...languages, language]
        }
      });
    }
    
    return project;
  }

  async removeLanguage(id: string, language: string) {
    const project = await this.prisma.project.findUnique({
      where: { id }
    });
    
    const languages = project?.languages || [];
    return this.prisma.project.update({
      where: { id },
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

  // Get all tokens in a project
  async getProjectTokens(projectId: string) {
    return this.prisma.token.findMany({
      where: { projectId }
    });
  }

  // Create new token
  async createToken(data: {
    projectId: string;
    key: string;
    tags?: string[];
    comment?: string;
    translations?: Record<string, string>; // Changed to use translation object directly
  }) {
    // Check if key already exists
    const existingToken = await this.prisma.token.findFirst({
      where: {
        projectId: data.projectId,
        key: data.key
      }
    });

    if (existingToken) {
      throw new BadRequestException(`Token key '${data.key}' already exists`);
    }

    // Create token and store translations directly
    return this.prisma.token.create({
      data: {
        projectId: data.projectId,
        key: data.key,
        tags: data.tags || [],
        comment: data.comment || '',
        translations: data.translations || {}, // Store translation object directly
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
    translations?: Record<string, string>; // Add translation object parameter
  }) {
    // Get token to confirm it exists
    const token = await this.getTokenById(tokenId);

    // If changing key, check for duplicates
    if (data.key && data.key !== token.key) {
      const existingToken = await this.prisma.token.findFirst({
        where: {
          projectId: token.projectId,
          key: data.key,
          NOT: { id: tokenId }
        }
      });

      if (existingToken) {
        throw new BadRequestException(`Token key '${data.key}' already exists`);
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
  async exportProjectTokens(projectId: string, options: {
    format: 'json' | 'csv' | 'xml' | 'yaml';
    scope?: 'all' | 'completed' | 'incomplete' | 'custom';
    languages?: string[];
    showEmptyTranslations?: boolean;
    prettify?: boolean;
    includeMetadata?: boolean;
    asZip?: boolean; // Add option: whether to export as ZIP package
  }) {
    // Get project information, mainly for supported language list
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new NotFoundException('Project does not exist');
    }

    // Get all tokens
    let tokens = await this.prisma.token.findMany({
      where: { projectId }
    });

    // Filter tokens based on scope
    if (options.scope) {
      tokens = this.filterTokensByScope(tokens, options.scope, project.languages);
    }

    // If languages are specified, only export translations for these languages
    const targetLanguages = (options.languages && options.languages.length > 0) 
      ? options.languages.filter(lang => project.languages.includes(lang))
      : project.languages;

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
      tokens = tokens.map(({ id, projectId, key, translations }) => ({
        id, projectId, key, translations
      }));
    }

    // Default export as ZIP (one file per language)
    return await createZipWithLanguageFiles(tokens, project, targetLanguages, options.format, {
      prettify: options.prettify
    });
  }

  // Import project content
  async importProjectTokens(projectId: string, data: {
    language: string;      // Language to import
    content: string;       // File content
    format: 'json' | 'csv' | 'xml' | 'yaml'; // Import format
    mode: 'append' | 'replace'; // Import mode
  }) {
    // Get project information
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new NotFoundException('Project does not exist');
    }

    // Verify if language is in project's supported language list
    if (!project.languages.includes(data.language)) {
      throw new BadRequestException(`Project does not support "${data.language}" language`);
    }

    // Parse imported data
    const importData = parseImportData(data.content, data.format);
    
    if (!importData || Object.keys(importData).length === 0) {
      throw new BadRequestException('Imported file does not contain valid data or has incorrect format');
    }

    // Get all current tokens for the project
    const existingTokens = await this.prisma.token.findMany({
      where: { projectId }
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
              projectId,
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
              projectId,
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
  private filterTokensByScope(tokens: any[], scope: string, projectLanguages: string[]) {
    switch (scope) {
      case 'all':
        return tokens;
      case 'completed':
        return tokens.filter(token => {
          const translations = token.translations as Record<string, string> || {};
          return projectLanguages.every(lang => translations[lang] && translations[lang].trim() !== '');
        });
      case 'incomplete':
        return tokens.filter(token => {
          const translations = token.translations as Record<string, string> || {};
          return projectLanguages.some(lang => !translations[lang] || translations[lang].trim() === '');
        });
      case 'custom':
        // Custom filter can be extended as needed
        return tokens;
      default:
        return tokens;
    }
  }

}