import type { Conversation } from "./conversation";
import { isConversation } from "./conversation";

export interface ExpertProfile {
  id: string;
  userId: string;
  bio: string;
  knowledgeBaseLinks: string[];
}

export function isExpertProfile(obj: unknown): obj is ExpertProfile {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const maybeProfile = obj as {
    id?: unknown;
    userId?: unknown;
    bio?: unknown;
    knowledgeBaseLinks?: unknown;
  };
  return (
    typeof maybeProfile.id === "string" &&
    typeof maybeProfile.userId === "string" &&
    typeof maybeProfile.bio === "string" &&
    Array.isArray(maybeProfile.knowledgeBaseLinks) &&
    maybeProfile.knowledgeBaseLinks.every(link => typeof link === "string")
  );
}

export interface ExpertQueue {
  waitingConversations: Conversation[]; // conversations waiting for some expert to claim them
  assignedConversations: Conversation[]; // conversations this expert has claimed and is actively working on
}

export function isExpertQueue(obj: unknown): obj is ExpertQueue {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const maybeQueue = obj as {
    waitingConversations?: unknown;
    assignedConversations?: unknown;
  };
  return (
    Array.isArray(maybeQueue.waitingConversations) &&
    Array.isArray(maybeQueue.assignedConversations) &&
    maybeQueue.waitingConversations.every(isConversation) &&
    maybeQueue.assignedConversations.every(isConversation)
  );
}

/**
 * ExpertAssignment Status States:
 *
 * 'active' - Expert is currently assigned and working on the conversation
 *   - assignedAt is set, unassignedAt is null
 *   - Expert can send messages, resolve the conversation, or unclaim it
 *   - Conversation.assignedExpertId = expertId, Conversation.status = 'active'
 *
 * 'unassigned' - Expert was assigned but then unclaimed the conversation
 *   - assignedAt and unassignedAt are both set
 *   - Conversation goes back to waiting status for another expert
 *   - Conversation.assignedExpertId = null, Conversation.status = 'waiting'
 *
 * 'resolved' - Expert successfully resolved the conversation
 *   - assignedAt and unassignedAt are both set
 *   - Conversation is closed and no longer needs expert attention
 *   - Conversation.status = 'resolved'
 *
 * Workflow:
 * 1. Conversation created → status: 'waiting', no expert assigned
 * 2. Expert claims it → ExpertAssignment created with status: 'active'
 * 3. Expert unclaims it → ExpertAssignment updated to status: 'unassigned'
 * 4. Expert resolves it → ExpertAssignment updated to status: 'resolved'
 *
 * This provides complete audit trail of expert involvement in each conversation.
 */
export interface ExpertAssignment {
  id: string;
  conversationId: string;
  expertId: string;
  assignedAt: string;
  unassignedAt?: string;
  status: "active" | "unassigned" | "resolved";
}

export interface UpdateExpertProfileRequest {
  bio?: string;
  knowledgeBaseLinks?: string[];
}

export function isExpertAssignment(obj: unknown): obj is ExpertAssignment {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const maybeAssignment = obj as {
    id?: unknown;
    conversationId?: unknown;
    expertId?: unknown;
    assignedAt?: unknown;
    unassignedAt?: unknown;
    status?: unknown;
  };
  return (
    typeof maybeAssignment.id === "string" &&
    typeof maybeAssignment.conversationId === "string" &&
    typeof maybeAssignment.expertId === "string" &&
    typeof maybeAssignment.assignedAt === "string" &&
    (maybeAssignment.unassignedAt === undefined || typeof maybeAssignment.unassignedAt === "string") &&
    (maybeAssignment.status === "active" ||
      maybeAssignment.status === "unassigned" ||
      maybeAssignment.status === "resolved")
  );
}
