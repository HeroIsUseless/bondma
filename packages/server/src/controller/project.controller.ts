import { Controller, Get, Post, Put, Delete, Param, Body, Logger, UseGuards, ForbiddenException, NotFoundException, Res, Header, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../jwt/guard';
import { CurrentUser } from '../jwt/current-user.decorator';
import { Response } from 'express';
import { UserService } from 'src/service/user.service';

interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

@Controller('api/project')
export class ProjectController {
  constructor(private projectService: ProjectService, private userService: UserService) {}

  @Post('create')
  async createProject(@Body() data: { 
    name: string; 
    teamId: string; 
    url: string; 
    description?: string;
    languages?: string[];
  }) {
    return this.projectService.createProject(data);
  }

  @Get('all')
  async findAllProjects() {
    return this.projectService.findAllProjects();
  }

  @Get('find/:id')
  async findProjectById(@Param('id') id: string) {
    return this.projectService.findProjectById(id);
  }

  @Put('update/:id')
  async updateProject(@Param('id') id: string, @Body() data: { 
    name?: string;
    description?: string;
    languages?: string[];
  }) {
    return this.projectService.updateProject(id, data);
  }

  @Delete('delete/:id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }

  @Get('team/:teamId')
  async findProjectsByTeamId(@Param('teamId') teamId: string) {
    return this.projectService.findProjectsByTeamId(teamId);
  }

  @Post('language/:id')
  async addLanguage(@Param('id') id: string, @Body() data: { language: string }) {
    return this.projectService.addLanguage(id, data.language);
  }

  @Delete('language/:id/:language')
  async removeLanguage(@Param('id') id: string, @Param('language') language: string) {
    return this.projectService.removeLanguage(id, language);
  }

  // Check if user has permission to read/write project
  @Get('check/:id')
  @UseGuards(AuthGuard)
  async checkProjectPermission(
    @Param('id') projectId: string,
    @CurrentUser() user: UserPayload
  ) {
    return await this.projectService.checkUserProjectPermission(projectId, user.userId);
  }

  // ============= Token related APIs =============

  // Get all tokens of a project
  @Get('tokens/:projectId')
  @UseGuards(AuthGuard)
  async getProjectTokens(
    @Param('projectId') projectId: string,
    @CurrentUser() user: UserPayload
  ) {
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this project');
    }
    
    return this.projectService.getProjectTokens(projectId);
  }

  // Create token
  @Post('token')
  @UseGuards(AuthGuard)
  async createToken(
    @Body() data: {
      projectId: string;
      key: string;
      tags?: string[];
      comment?: string;
      translations?: Record<string, string>; // Using translation object directly instead of array
    },
    @CurrentUser() user: UserPayload
  ) {
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(data.projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to create content in this project');
    }
    
    return this.projectService.createToken(data);
  }

  // Get token details
  @Get('token/:tokenId')
  @UseGuards(AuthGuard)
  async getToken(
    @Param('tokenId') tokenId: string,
    @CurrentUser() user: UserPayload
  ) {
    const token = await this.projectService.getTokenById(tokenId);
    if (!token || !token.projectId) {
      throw new NotFoundException(`Project ${token.projectId} does not exist`);
    }
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(token.projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this content');
    }
    
    return token;
  }

  // Update token
  @Put('token/:tokenId')
  @UseGuards(AuthGuard)
  async updateToken(
    @Param('tokenId') tokenId: string,
    @Body() data: {
      key?: string;
      tags?: string[];
      comment?: string;
      translations?: Record<string, string>; // Add direct translation object
    },
    @CurrentUser() user: UserPayload
  ) {
    // First get token to ensure it exists
    const token = await this.projectService.getTokenById(tokenId);
    if (!token || !token.projectId) {
      throw new NotFoundException(`Project ${token.projectId} does not exist`);
    }
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(token.projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to modify this content');
    }
    
    return this.projectService.updateToken(tokenId, data);
  }

  // Delete token
  @Delete('token/:tokenId')
  @UseGuards(AuthGuard)
  async deleteToken(
    @Param('tokenId') tokenId: string,
    @CurrentUser() user: UserPayload
  ) {
    // First get token to ensure it exists
    const token = await this.projectService.getTokenById(tokenId);
    if (!token || !token.projectId) {
      throw new NotFoundException(`Project ${token.projectId} does not exist`);
    }
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(token.projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to delete this content');
    }
    
    return this.projectService.deleteToken(tokenId);
  }

  // Export project content
  @Post('export/:projectId')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/zip')
  async exportProject(
    @Param('projectId') projectId: string,
    @Body() data: {
      format: 'json' | 'csv' | 'xml' | 'yaml'; // Export format
      scope?: 'all' | 'completed' | 'incomplete' | 'custom'; // Export scope
      languages?: string[]; // Selected languages
      showEmptyTranslations?: boolean; // Whether to include empty translations
      prettify?: boolean; // Beautify output
      includeMetadata?: boolean; // Whether to include metadata
    },
    @CurrentUser() user: UserPayload,
    @Res() res: Response
  ) {
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to export this project');
    }
    
    try {
      // Call service to export data as ZIP package
      const zipBuffer = await this.projectService.exportProjectTokens(projectId, data);
      
      // Set response headers
      res.setHeader('Content-Disposition', `attachment; filename="translations-${projectId}.zip"`);
      res.setHeader('Content-Type', 'application/zip');
      
      // Send ZIP file
      return res.send(zipBuffer);
    } catch (error) {
      Logger.error(`Export failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Directly download project content via URL (supports direct download in browser)
  @Get('download/:projectId')
  @Header('Content-Type', 'application/zip')
  async downloadProject(
    @Param('projectId') projectId: string,
    @Query('format') format: 'json' | 'csv' | 'xml' | 'yaml' = 'json', // Default to json
    @Query('scope') scope: 'all' | 'completed' | 'incomplete' | 'custom' = 'all',
    @Query('languages') languages: string, // Comma-separated language list, e.g. 'zh,en,ja'
    @Query('showEmptyTranslations') showEmptyTranslations: string,
    @Query('prettify') prettify: string,
    @Query('includeMetadata') includeMetadata: string,
    @Query('username') username: string, // Username
    @Query('password') password: string, // Password
    @Query('apiKey') apiKey: string, // Optional API key
    @Res() res: Response
  ) {
    try {
      // First try to authenticate user
      let userId: string;
      
      // If apiKey is provided, use apiKey for verification first
      // if (apiKey) {
      //   const apiKeyInfo = await this.userService.validateApiKey(apiKey, projectId);
      //   if (!apiKeyInfo) {
      //     throw new UnauthorizedException('API key is invalid or expired');
      //   }
      //   userId = apiKeyInfo.userId;
      // }
      // Otherwise, use username and password for verification
      if (username && password) {
        const user = await this.userService.validateUser(username, password);
        if (!user) {
          throw new UnauthorizedException('Username or password incorrect');
        }
        userId = user.id;
      } else {
        throw new UnauthorizedException('Please provide valid authentication information (username/password or API key)');
      }
      
      // Verify project permission
      const hasPermission = await this.projectService.checkUserProjectPermission(projectId, userId);
      if (!hasPermission) {
        throw new ForbiddenException('You do not have permission to download this project');
      }
      
      // Process query parameters
      const exportConfig = {
        format,
        scope,
        languages: languages ? languages.split(',') : undefined,
        showEmptyTranslations: showEmptyTranslations === 'true',
        prettify: prettify === 'true',
        includeMetadata: includeMetadata === 'true',
      };
      
      // Call service to export data as ZIP package
      const zipBuffer = await this.projectService.exportProjectTokens(projectId, exportConfig);
      
      // Set response headers
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      res.setHeader('Content-Disposition', `attachment; filename="translations-${projectId}-${timestamp}.zip"`);
      res.setHeader('Content-Type', 'application/zip');
      
      // Send ZIP file
      return res.send(zipBuffer);
    } catch (error) {
      Logger.error(`Download failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Import project content
  @Post('import/:projectId')
  @UseGuards(AuthGuard)
  async importProject(
    @Param('projectId') projectId: string,
    @Body() data: {
      language: string;      // Language to import
      content: string;       // File content
      format: 'json' | 'csv' | 'xml' | 'yaml'; // Import format
      mode: 'append' | 'replace'; // Import mode
    },
    @CurrentUser() user: UserPayload
  ) {
    // Verify permission
    const hasPermission = await this.projectService.checkUserProjectPermission(projectId, user.userId);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to import content to this project');
    }
    
    try {
      const result = await this.projectService.importProjectTokens(projectId, data);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      Logger.error(`Import failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Import failed: ${error.message}`);
    }
  }
}