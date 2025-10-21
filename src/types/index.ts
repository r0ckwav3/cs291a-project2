// User types
export type { User } from "./user";
export { isUser } from "./user";

// Conversation types
export type {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
} from "./conversation";
export { isConversation } from "./conversation";

// Message types
export type { Message, SendMessageRequest, MessageUpdate } from "./message";
export { isMessage } from "./message";

// Expert types
export type {
  ExpertProfile,
  ExpertQueue,
  ExpertAssignment,
  UpdateExpertProfileRequest,
} from "./expert";
export { isExpertQueue, isExpertProfile, isExpertAssignment } from "./expert";

// Service types
export type {
  AuthService,
  RegisterRequest,
  LoginResponseUser,
  LoginResponse,
  ChatService,
  UpdateService,
  ChatServiceFactory,
  UpdateServiceFactory,
} from "./services";
export { isLoginResponse, isLoginResponseUser } from "./services";

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
