// User types
export type { User } from "./user";
export { isUser } from "./user";

// Conversation types
export type {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
} from "./conversation";

// Message types
export type { Message, SendMessageRequest, MessageUpdate } from "./message";

// Expert types
export type {
  ExpertProfile,
  ExpertQueue,
  ExpertAssignment,
  UpdateExpertProfileRequest,
} from "./expert";

// Service types
export type {
  AuthService,
  RegisterRequest,
  RegisterResponse,
  ChatService,
  UpdateService,
  ChatServiceFactory,
  UpdateServiceFactory,
} from "./services";
export { isRegisterResponse } from "./services";

// Configuration types
export type {
  AppConfig,
  ServiceConfig,
  AuthServiceConfig,
  ChatServiceConfig,
  UpdateServiceConfig,
} from "./config";

// Error and status types
export type { ApiError, ConnectionStatus, LoadingState } from "./errors";
