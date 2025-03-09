import { User } from "@/jotai/types";
import { apiClient } from "../lib/api";

// API Base Path
const API_BASE = '/api/user';

// Get user information
export async function getUserInfo(): Promise<User> {
  return apiClient.get(`${API_BASE}/me`);
}

// Update user information
export async function updateUser(id: string, data: { 
  name?: string; 
  email?: string;
}): Promise<User> {
  return apiClient.put(`${API_BASE}/${id}`, data);
}

// Search users
export async function searchUsers(keyword: string): Promise<User[]> {
  return apiClient.get(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`);
}

// Get specific user information
export async function getUserById(id: string): Promise<User> {
  return apiClient.get(`${API_BASE}/${id}`);
}
