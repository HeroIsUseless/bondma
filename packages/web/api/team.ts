import { Team } from "@/jotai/types";
import { apiClient } from "../lib/api";

// API Base Path
const API_BASE = '/api/team';

// Create new team
export async function createTeam(teamData: { name: string }): Promise<Team> {
  return apiClient.post<Team>(`${API_BASE}/create`, teamData);
}

// Get all teams of a user
export async function fetchUserTeams(): Promise<Team[]> {
  return apiClient.get<Team[]>(`${API_BASE}/all`);
}

// Get my team list
export async function fetchMyTeams(): Promise<Team[]> {
  return apiClient.get<Team[]>(`${API_BASE}/list`);
}

// Get team details
export async function getTeamById(id: string): Promise<Team> {
  return apiClient.get<Team>(`${API_BASE}/find/${id}`);
}

// Update team information
export async function updateTeam(id: string, data: { name?: string; url?: string }): Promise<Team> {
  return apiClient.put<Team>(`${API_BASE}/update/${id}`, data);
}

// Delete team
export async function deleteTeam(id: string): Promise<void> {
  return apiClient.delete(`${API_BASE}/delete/${id}`);
}

// Add team member
export async function addTeamMember(teamId: string, data: { userId: string; role: string }): Promise<any> {
  return apiClient.post(`${API_BASE}/addmember/${teamId}`, data);
}

// Update member role
export async function updateMemberRole(teamId: string, userId: string, data: { role: string }): Promise<any> {
  return apiClient.put(`${API_BASE}/updatemember/${teamId}/${userId}`, data);
}

// Remove team member
export async function removeMember(teamId: string, userId: string): Promise<void> {
  return apiClient.delete(`${API_BASE}/removemembers/${teamId}/${userId}`);
}

// Get team member list
export async function getTeamMembers(teamId: string): Promise<any[]> {
  return apiClient.get(`${API_BASE}/members/${teamId}`);
}

// Check if user has permission to access
export async function checkTeamPermission(teamId: string): Promise<boolean> {
  return apiClient.get(`${API_BASE}/check/${teamId}`);
}
