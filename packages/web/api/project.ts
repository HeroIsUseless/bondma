import { Team, Project, Token } from "@/jotai/types";
import { apiClient } from "../lib/api";

// API Base Path
const API_BASE = '/api/project';

// Get team project list
export async function getTeamProjects(teamId: string): Promise<Project[]> {
  return apiClient.get(`${API_BASE}/team/${teamId}`);
}

// Create new project
export async function createProject(data: { 
  name: string; 
  teamId: string;
  description?: string;
  languages?: string[];
}): Promise<Project> {
  // Auto-generate URL (can use pinyin or English conversion of project name)
  const url = data.name.toLowerCase().replace(/\s+/g, '-');
  
  return apiClient.post(`${API_BASE}/create`, {
    ...data,
    url
  });
}

// Get project details
export async function getProject(id: string): Promise<Project> {
  return apiClient.get(`${API_BASE}/find/${id}`);
}

// Update project
export async function updateProject(id: string, data: {
  name?: string;
  description?: string;
  languages?: string[];
}): Promise<Project> {
  return apiClient.put(`${API_BASE}/update/${id}`, data);
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  return apiClient.delete(`${API_BASE}/delete/${id}`);
}

// Add project language
export async function addProjectLanguage(id: string, language: string): Promise<Project> {
  return apiClient.post(`${API_BASE}/language/${id}`, { language });
}

// Remove project language
export async function removeProjectLanguage(id: string, language: string): Promise<Project> {
  return apiClient.delete(`${API_BASE}/language/${id}/${language}`);
}

// Check user's permission for the project
export async function checkProjectPermission(projectId: string): Promise<boolean> {
  return apiClient.get(`${API_BASE}/check/${projectId}`);
}

// ============= Token Related API =============

// Get all tokens of a project
export async function getProjectTokens(projectId: string): Promise<Token[]> {
  return apiClient.get(`${API_BASE}/tokens/${projectId}`);
}

// Create new token
export async function createToken(projectId: string, data: {
  key: string;
  tags?: string[];
  comment?: string;
  translations?: Record<string, string>; // Changed to directly use translation object
}): Promise<Token> {
  return apiClient.post(`${API_BASE}/token`, {
    projectId,
    ...data
  });
}

// Get single token details
export async function getToken(tokenId: string): Promise<Token> {
  return apiClient.get(`${API_BASE}/token/${tokenId}`);
}

// Update token
export async function updateToken(tokenId: string, data: {
  key?: string;
  tags?: string[];
  comment?: string;
  translations?: Record<string, string>; // Added translation object parameter
}): Promise<Token> {
  return apiClient.put(`${API_BASE}/token/${tokenId}`, data);
}

// Delete token
export async function deleteToken(tokenId: string): Promise<void> {
  return apiClient.delete(`${API_BASE}/token/${tokenId}`);
}

// Export project copy
export async function exportProjectTokens(projectId: string, options: {
  format: 'json' | 'csv' | 'xml' | 'yaml';
  scope?: 'all' | 'completed' | 'incomplete' | 'custom';
  languages?: string[];
  showEmptyTranslations?: boolean;
  prettify?: boolean;
  includeMetadata?: boolean;
}) {
  // Use blob response type to handle file download
  return apiClient.post(
    `${API_BASE}/export/${projectId}`, 
    options, 
    { responseType: 'blob' }
  );
}

// Import project copy
export async function importProjectTokens(projectId: string, data: {
  language: string;
  content: string;
  format: 'json' | 'csv' | 'xml' | 'yaml';
  mode: 'append' | 'replace';
}): Promise<{
  success: boolean;
  message: string;
  stats: {
    added: number;        // Number of added tokens
    updated: number;      // Number of updated tokens
    unchanged: number;    // Number of unchanged tokens
    total: number;        // Total processed tokens
  }
}> {
  return apiClient.post(`${API_BASE}/import/${projectId}`, data);
}
