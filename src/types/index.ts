export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'member';
  isActive: boolean;
  joinedAt: Date;
}

export interface ChamaGroup {
  id: string;
  name: string;
  description: string;
  dailyAmount: number;
  currency: string;
  deadlineTime: string; // HH:MM format
  penaltyAmount: number;
  members: User[];
  rotationOrder: string[]; // Array of user IDs in rotation order
  currentRecipientIndex: number;
  isActive: boolean;
  isPaused: boolean;
  pauseReason?: string;
  createdAt: Date;
  adminId: string;
}

export interface Contribution {
  id: string;
  userId: string;
  groupId: string;
  amount: number;
  date: Date;
  status: 'pending' | 'paid' | 'late' | 'penalty';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: Date;
  penaltyAmount?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile' | 'bank';
  icon: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  groupId: string;
  type: 'reminder' | 'penalty' | 'payout' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface DailyStatus {
  date: Date;
  recipientId: string;
  contributions: Contribution[];
  totalCollected: number;
  expectedTotal: number;
  isComplete: boolean;
  isPaidOut: boolean;
}