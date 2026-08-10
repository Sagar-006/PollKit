export interface Poll {
  id: string;
  userId: string;
  question: string;
  isActive: boolean;
  isPublished: boolean;
  anonymousVoting: boolean;
  createdAt: string;
  expiresAt: string;
}
