import type { ChatService } from "@/types";
import type {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
  Message,
  SendMessageRequest,
  ExpertProfile,
  ExpertQueue,
  ExpertAssignment,
  UpdateExpertProfileRequest,
} from "@/types";
import {
  isConversation,
  isMessage,
  isExpertQueue,
  isExpertProfile,
  isExpertAssignment,
} from "@/types";
import TokenManager from "@/services/TokenManager";

interface ApiChatServiceConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * API implementation of ChatService for production use
 * Uses fetch for HTTP requests
 */
export class ApiChatService implements ChatService {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(config: ApiChatServiceConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenManager = TokenManager.getInstance();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // 1. Construct the full URL
    const url = `${this.baseUrl}${endpoint}`;

    // 2. Get the token
    const token = this.tokenManager.getToken();
    let authorization = "";
    if (token != null) {
      authorization = `Basic ${token}`;
    }

    // 3. Set up default headers
    // 4. Add Authorization header with Bearer token if token exists
    const defaultHeaders: HeadersInit = {
      Authorization: authorization,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // 5. Make the fetch request with the provided options
    const fetchOptions: RequestInit = {
      ...options,
      headers: defaultHeaders,
      credentials: "include",
    };

    const response = await fetch(url, fetchOptions);

    // 6. Handle non-ok responses
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

    // 7. Return the parsed JSON response
    return response.json();
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the array of conversations
    const response = await this.makeRequest<Conversation[]>("/conversations");
    if (!(Array.isArray(response) && response.every(isConversation))) {
      throw new Error("getConversations response is in an unexpected format");
    }
    return response;
  }

  async getConversation(id: string): Promise<Conversation> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the conversation object
    const response = await this.makeRequest<Conversation>(
      `/conversations/${id}`,
    );
    if (!isConversation(response)) {
      throw new Error("getConversation response is in an unexpected format");
    }
    return response;
  }

  async createConversation(
    request: CreateConversationRequest,
  ): Promise<Conversation> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the created conversation object
    const body = { title: request.title };
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(body),
    };
    const response = await this.makeRequest<Conversation>(
      "/conversations",
      options,
    );
    if (!isConversation(response)) {
      throw new Error("createConversation response is in an unexpected format");
    }
    return response;
  }

  async updateConversation(
    id: string,
    request: UpdateConversationRequest,
  ): Promise<Conversation> {
    // SKIP, not currently used by application

    throw new Error("updateConversation method not implemented");
  }

  async deleteConversation(id: string): Promise<void> {
    // SKIP, not currently used by application

    throw new Error("deleteConversation method not implemented");
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the array of messages
    const response = await this.makeRequest<Message[]>(
      `/conversations/${conversationId}/messages`,
    );
    if (!(Array.isArray(response) && response.every(isMessage))) {
      throw new Error("getMessages response is in an unexpected format");
    }
    return response;
  }

  async sendMessage(request: SendMessageRequest): Promise<Message> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the created message object
    const body = {
      conversationId: request.conversationId,
      content: request.content,
    };
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(body),
    };
    const response = await this.makeRequest<Message>(`/messages`, options);
    if (!isMessage(response)) {
      throw new Error("sendMessage response is in an unexpected format");
    }
    return response;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    // SKIP, not currently used by application

    throw new Error("markMessageAsRead method not implemented");
  }

  // Expert-specific operations
  async getExpertQueue(): Promise<ExpertQueue> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the expert queue object with waitingConversations and assignedConversations
    const response = await this.makeRequest<Message>(`/expert/queue`);
    if (!isExpertQueue(response)) {
      throw new Error("getExpertQueue response is in an unexpected format");
    }
    return response;
  }

  async claimConversation(conversationId: string): Promise<void> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return void (no response body expected)
    const options: RequestInit = {
      method: "POST",
    };
    const response = await this.makeRequest<any>(
      `/expert/conversations/${conversationId}/claim`,
      options,
    );
    if (response.success === undefined) {
      throw new Error("claimConversation response is in an unexpected format");
    }
    return;
  }

  async unclaimConversation(conversationId: string): Promise<void> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return void (no response body expected)
    const options: RequestInit = {
      method: "POST",
    };
    const response = await this.makeRequest<any>(
      `/expert/conversations/${conversationId}/unclaim`,
      options,
    );
    if (response.success === undefined) {
      throw new Error(
        "unclaimConversation response is in an unexpected format",
      );
    }
    return;
  }

  async getExpertProfile(): Promise<ExpertProfile> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the expert profile object
    const response = await this.makeRequest<ExpertProfile>(`/expert/profile`);
    if (!response.bio) {
      response.bio = "";
    }
    if (!isExpertProfile(response)) {
      throw new Error("getExpertProfile response is in an unexpected format");
    }
    return response;
  }

  async updateExpertProfile(
    request: UpdateExpertProfileRequest,
  ): Promise<ExpertProfile> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the updated expert profile object

    const body = {
      bio: request.bio,
      knowledgeBaseLinks: request.knowledgeBaseLinks,
    };
    const options: RequestInit = {
      method: "PUT",
      body: JSON.stringify(body),
    };
    const response = await this.makeRequest<Conversation>(
      "/expert/profile",
      options,
    );
    if (!isExpertProfile(response)) {
      throw new Error(
        "updateExpertProfile response is in an unexpected format",
      );
    }
    return response;
  }

  async getExpertAssignmentHistory(): Promise<ExpertAssignment[]> {
    // This should:
    // 1. Make a request to the appropriate endpoint
    // 2. Return the array of expert assignments
    const response = await this.makeRequest<ExpertAssignment[]>(
      `/expert/assignments/history`,
    );
    if (!(Array.isArray(response) && response.every(isExpertAssignment))) {
      throw new Error(
        "getExpertAssignmentHistory response is in an unexpected format",
      );
    }
    return response;
  }
}
