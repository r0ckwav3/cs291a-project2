export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "initiator" | "expert";
  senderUsername: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  status?: "sending" | "sent" | "failed";
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export interface MessageUpdate {
  id: string;
  conversationId: string;
  content?: string;
  isRead?: boolean;
}

export function isMessage(obj: any): obj is Message {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.conversationId === "string" &&
    typeof obj.senderId === "string" &&
    (obj.senderRole === "initiator" || obj.senderRole === "expert") &&
    typeof obj.senderUsername === "string" &&
    typeof obj.content === "string" &&
    typeof obj.timestamp === "string" &&
    typeof obj.isRead === "boolean" &&
    (obj.status === undefined ||
      obj.status === "sending" ||
      obj.status === "sent" ||
      obj.status === "failed")
  );
}
