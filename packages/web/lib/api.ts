/**
 * Encapsulated fetch API, automatically adding authentication token and error handling
 */

interface FetchOptions extends RequestInit {
  requireAuth?: boolean; // Whether authentication is needed, default is true
  baseUrl?: string; // API base URL, default is empty
  responseType?: 'json' | 'blob' | 'text'; // Response type, default is 'json'
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Encapsulated fetch function, automatically adding authentication and handling common errors
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    requireAuth = true,
    baseUrl = '',
    headers = {},
    responseType = 'json',
    ...restOptions
  } = options;

  // Build request headers
  const requestHeaders: HeadersInit = { ...headers };
  const headerRecord = requestHeaders as Record<string, string>;

  // Set JSON content-type by default
  if (!headerRecord['Content-Type'] && !(options.body instanceof FormData)) {
    headerRecord['Content-Type'] = 'application/json';
  }

  // Add token if authentication is required
  if (requireAuth) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return {
        error: 'Authentication failed: Access token not found',
        status: 401
      };
    }
    (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Build URL
  const url = `${baseUrl}${endpoint}`;

  // Log request information
  console.group(`API Request: ${restOptions.method || 'GET'} ${url}`);
  console.log('Headers:', { ...headerRecord });
  if (options.body) {
    try {
      const bodyContent = options.body instanceof FormData
        ? 'Form data'
        : typeof options.body === 'string'
          ? JSON.parse(options.body)
          : options.body;
      console.log('Request Body:', bodyContent);
    } catch (e) {
      console.log('Request Body:', options.body);
    }
  }

  try {
    // Send request
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // Log response status
    console.log(`Response Status: ${response.status} ${response.statusText}`);

    // Handle non-2xx responses
    if (!response.ok) {
      // Try to parse error information
      try {
        const errorData = await response.json();
        console.log('Response Error:', errorData);
        console.groupEnd();
        return {
          error: errorData.message || `Request failed, status code: ${response.status}`,
          status: response.status
        };
      } catch (parseError) {
        console.log('Response Parse Error:', parseError);
        console.groupEnd();
        return {
          error: `Request failed, status code: ${response.status}`,
          status: response.status
        };
      }
    }

    // Handle empty response
    if (response.status === 204) {
      console.log('Empty Response (204 No Content)');
      console.groupEnd();
      return { status: 204 };
    }

    // Handle different types of responses based on responseType
    let data: any;
    
    switch(responseType) {
      case 'blob':
        data = await response.blob();
        console.log('Response Data: [Blob data]');
        break;
      case 'text':
        data = await response.text();
        console.log('Response Data:', data);
        break;
      case 'json':
      default:
        data = await response.json();
        console.log('Response Data:', data);
        break;
    }
    
    console.groupEnd();
    return {
      data,
      status: response.status
    };
  } catch (error) {
    // Handle network errors
    console.error('Network Error:', error);
    console.groupEnd();
    return {
      error: error instanceof Error ? error.message : 'Network request failed',
      status: 0 // 0 indicates network error
    };
  }
}

/**
 * Check and handle API response results
 * If there is an error, throw an error; otherwise return the data
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data as T;
}

/**
 * API request utility object, providing GET, POST, PUT, DELETE methods
 */
export const apiClient = {
  get: async <T>(endpoint: string, options: Omit<FetchOptions, 'method' | 'body'> = {}) => {
    const response = await apiFetch<T>(endpoint, { ...options, method: 'GET' });
    return handleApiResponse(response);
  },

  post: async <T>(endpoint: string, data: any, options: Omit<FetchOptions, 'method'> = {}) => {
    const response = await apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },

  put: async <T>(endpoint: string, data: any, options: Omit<FetchOptions, 'method'> = {}) => {
    const response = await apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },

  delete: async <T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) => {
    const response = await apiFetch<T>(endpoint, { ...options, method: 'DELETE' });
    return handleApiResponse(response);
  }
};
