import type {
  AuthService,
  RegisterRequest,
  LoginResponse,
  User,
  AuthServiceConfig,
} from "@/types";
import { isLoginResponse } from "@/types";
import TokenManager from "@/services/TokenManager";

/**
 * API-based implementation of AuthService
 * Uses fetch for HTTP requests
 */
export class ApiAuthService implements AuthService {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(config: AuthServiceConfig) {
    this.baseUrl = config.baseUrl || "http://localhost:3000";
    this.tokenManager = TokenManager.getInstance();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // 1. Construct the full URL
    const url = `${this.baseUrl}${endpoint}`;

    // 2. Set up default headers
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // 3. Use {credentials: 'include'} for session cookies
    const fetchOptions: RequestInit = {
      ...options,
      headers: defaultHeaders,
      credentials: "include",
    };

    // 4. Make the fetch request
    const response = await fetch(url, fetchOptions);

    // 5. Handle non-ok responses
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData && errorData.errors) {
          errorMessage = JSON.stringify(errorData.errors);
        }
      } catch {
        errorMessage = "Unknown error";
      }
      throw new Error(`Request failed (${response.status}): ${errorMessage}`);
    }

    // 6. Return the parsed JSON response
    return response.json();
  }

  async login(username: string, password: string): Promise<User> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Store the token using this.tokenManager.setToken(response.token)
    // 3. Return the user object

    const body = { username, password };
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(body),
    };

    const response = await this.makeRequest<LoginResponse>(
      "/auth/login",
      options,
    );
    if (!isLoginResponse(response)) {
      throw new Error("response is in an unexpected format");
    }

    this.tokenManager.setToken(response.token);

    const user: User = {
      id: response.user.id,
      username: response.user.username,
      createdAt: response.user.created_at,
      lastActiveAt: response.user.last_active_at,
    };

    return user;
  }

  async register(userData: RegisterRequest): Promise<User> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Store the token using this.tokenManager.setToken(response.token)
    // 3. Return the user object

    const body = {
      username: userData.username,
      password: userData.password,
    };
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(body),
    };

    const response = await this.makeRequest<LoginResponse>(
      "/auth/register",
      options,
    );
    if (!isLoginResponse(response)) {
      throw new Error("response is in an unexpected format");
    }

    this.tokenManager.setToken(response.token);

    const user: User = {
      id: response.user.id,
      username: response.user.username,
      createdAt: response.user.created_at,
      lastActiveAt: response.user.last_active_at,
    };

    return user;
  }

  async logout(): Promise<void> {
    const options: RequestInit = {
      method: "POST",
    };

    try {
      const response = await this.makeRequest("/auth/logout", options);
      if (!response || !response.message) {
        throw new Error("unexpected response from logout");
      }
    } finally {
      console.log("logged out");
      this.tokenManager.clearToken();
    }
  }

  async refreshToken(): Promise<User> {
    // TODO: Implement refreshToken method
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 3. Update the stored token using this.tokenManager.setToken(response.token)
    // 4. Return the user object
    //
    // See API_SPECIFICATION.md for endpoint details

    throw new Error("refreshToken method not implemented");
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement getCurrentUser method
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the user object if successful
    // 3. If the request fails (e.g., session invalid), clear the token and return null
    //
    // See API_SPECIFICATION.md for endpoint details

    throw new Error("getCurrentUser method not implemented");
  }
}
