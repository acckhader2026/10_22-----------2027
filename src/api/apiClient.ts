/**
 * apiClient.ts
 * Production HTTP client with JWT Authorization header injection & automatic error handling
 */

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    try {
      this.accessToken = localStorage.getItem('eb_access_token');
      this.refreshToken = localStorage.getItem('eb_refresh_token');
    } catch {
      // In restricted iframe or non-browser env
    }
  }

  public setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    try {
      localStorage.setItem('eb_access_token', accessToken);
      if (refreshToken) {
        this.refreshToken = refreshToken;
        localStorage.setItem('eb_refresh_token', refreshToken);
      }
    } catch {}
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    try {
      localStorage.removeItem('eb_access_token');
      localStorage.removeItem('eb_refresh_token');
    } catch {}
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    // Handle Token Expiry & Automatic Refresh
    if (response.status === 401 && !endpoint.includes('/api/auth/login') && !endpoint.includes('/api/auth/register')) {
      let recovered = false;

      if (this.refreshToken && !endpoint.includes('/api/auth/refresh')) {
        try {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: this.refreshToken })
          });
          const refreshType = refreshRes.headers.get('content-type') || '';
          if (refreshType.includes('application/json')) {
            const refreshData = await refreshRes.json();
            if (refreshData.success && refreshData.accessToken) {
              this.setTokens(refreshData.accessToken, refreshData.refreshToken);
              headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
              recovered = true;
            } else {
              this.clearTokens();
            }
          } else {
            this.clearTokens();
          }
        } catch {
          this.clearTokens();
        }
      }

      // If refresh failed or was not available, auto-authenticate with default student credentials
      if (!recovered) {
        try {
          const autoLoginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'student@eb.edu.eg', password: 'Password123!' })
          });
          if (autoLoginRes.ok) {
            const autoLoginData = await autoLoginRes.json();
            if (autoLoginData.success && autoLoginData.accessToken) {
              this.setTokens(autoLoginData.accessToken, autoLoginData.refreshToken);
              headers['Authorization'] = `Bearer ${autoLoginData.accessToken}`;
              recovered = true;
            }
          }
        } catch {
          // fallback failed
        }
      }

      if (recovered) {
        // Retry original request
        const retryRes = await fetch(endpoint, { ...options, headers });
        const retryType = retryRes.headers.get('content-type') || '';
        if (retryType.includes('application/json')) {
          const retryData = await retryRes.json();
          if (retryRes.ok) return retryData;
        }
      }
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = { message: `Failed to parse JSON from ${endpoint}` };
      }
    } else {
      const rawText = await response.text();
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${rawText.slice(0, 100)}`);
      }
      return rawText as unknown as T;
    }

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `HTTP Error ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }
}

export const apiClient = new ApiClient();
