export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  // Attach token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Safely check for FormData to avoid Content-Type JSON override
  const isFormData = options.body && options.body.constructor && options.body.constructor.name === 'FormData';

  // Set default content type if not doing multipart/form-data
  if (!isFormData && !(options.body instanceof FormData) && !headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = Array.isArray(errorData.detail)
          ? errorData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
          : errorData.detail;
      } else {
        errorMessage = errorData.message || errorMessage;
      }
    } catch {
      // Ignore if not JSON
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}
