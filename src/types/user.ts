export interface User {
  id: string;
  username: string;
  createdAt: string;
  lastActiveAt: string;
}

export function isUser(obj: any): obj is User {
  return (
    obj.id !== undefined &&
    obj.username !== undefined &&
    obj.createdAt !== undefined &&
    obj.lastActiveAt !== undefined
  );
}
