import { apiClient } from "../lib/api";

// API Base Path
const API_BASE = '/api/auth';

// User type definition
export interface User {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Login response type
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Registration response type
interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

// Authentication status response type
interface AuthStatusResponse {
  status: string;
  user: User;
}

/**
 * User login
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>(`${API_BASE}/login`, {
    email,
    password
  }, {
    requireAuth: false // Login doesn't require authentication header
  });
}

/**
 * User registration
 */
export async function register(name: string, email: string, password: string): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>(`${API_BASE}/register`, {
    name,
    email,
    password
  }, {
    requireAuth: false // Registration doesn't require authentication header
  });
}

/**
 * Check user authentication status
 */
export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  return apiClient.get<AuthStatusResponse>(`${API_BASE}/status`);
}

/**
 * Get current user information
 */
export async function getCurrentUser(): Promise<User> {
  const response = await checkAuthStatus();
  return response.user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: {
  name?: string;
  email?: string;
  avatarUrl?: string;
}): Promise<User> {
  return apiClient.put<User>(`/api/users/${userId}`, data);
}

/**
 * Change password
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<{success: boolean; message: string}> {
  return apiClient.post<{success: boolean; message: string}>(`/api/users/change-password`, {
    oldPassword,
    newPassword
  });
}
