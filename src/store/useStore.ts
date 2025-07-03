import { create } from 'zustand';
import { User, ChamaGroup, Contribution, Notification, PaymentMethod } from '../types';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Groups
  currentGroup: ChamaGroup | null;
  groups: ChamaGroup[];
  
  // Contributions
  contributions: Contribution[];
  todayContributions: Contribution[];
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentGroup: (group: ChamaGroup) => void;
  addContribution: (contribution: Omit<Contribution, 'id'>) => void;
  updateContribution: (id: string, updates: Partial<Contribution>) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  pauseGroup: (groupId: string, reason: string) => void;
  resumeGroup: (groupId: string) => void;
  updateGroupSettings: (groupId: string, updates: Partial<ChamaGroup>) => void;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john@example.com',
    phone: '+254712345678',
    role: 'admin',
    isActive: true,
    joinedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    email: 'mary@example.com',
    phone: '+254723456789',
    role: 'member',
    isActive: true,
    joinedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    email: 'peter@example.com',
    phone: '+254734567890',
    role: 'member',
    isActive: true,
    joinedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Grace Akinyi',
    email: 'grace@example.com',
    phone: '+254745678901',
    role: 'member',
    isActive: true,
    joinedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'David Kiprop',
    email: 'david@example.com',
    phone: '+254756789012',
    role: 'member',
    isActive: true,
    joinedAt: new Date('2024-01-05'),
  },
];

const mockGroup: ChamaGroup = {
  id: '1',
  name: 'Harambee Savings Group',
  description: 'Monthly rotating savings for our community',
  dailyAmount: 100,
  currency: 'KES',
  deadlineTime: '20:00',
  penaltyAmount: 20,
  members: mockUsers,
  rotationOrder: ['1', '2', '3', '4', '5'],
  currentRecipientIndex: 0,
  isActive: true,
  isPaused: false,
  createdAt: new Date('2024-01-01'),
  adminId: '1',
};

const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'M-Pesa', type: 'mobile', icon: '📱', isActive: true },
  { id: '2', name: 'Equity Bank', type: 'bank', icon: '🏦', isActive: true },
  { id: '3', name: 'KCB Bank', type: 'bank', icon: '🏦', isActive: true },
  { id: '4', name: 'Airtel Money', type: 'mobile', icon: '📱', isActive: true },
];

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  currentGroup: null,
  groups: [mockGroup],
  contributions: [],
  todayContributions: [],
  notifications: [],
  unreadCount: 0,
  paymentMethods: mockPaymentMethods,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      set({ 
        currentUser: user, 
        isAuthenticated: true, 
        currentGroup: mockGroup,
        isLoading: false 
      });
    } else {
      set({ 
        error: 'Invalid credentials', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      currentGroup: null,
      contributions: [],
      todayContributions: [],
      notifications: [],
      unreadCount: 0,
    });
  },

  setCurrentGroup: (group: ChamaGroup) => {
    set({ currentGroup: group });
  },

  addContribution: (contribution) => {
    const newContribution: Contribution = {
      ...contribution,
      id: Date.now().toString(),
    };
    
    set(state => ({
      contributions: [...state.contributions, newContribution],
      todayContributions: [...state.todayContributions, newContribution],
    }));
  },

  updateContribution: (id: string, updates: Partial<Contribution>) => {
    set(state => ({
      contributions: state.contributions.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ),
      todayContributions: state.todayContributions.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    
    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markNotificationRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  pauseGroup: (groupId: string, reason: string) => {
    set(state => ({
      currentGroup: state.currentGroup?.id === groupId 
        ? { ...state.currentGroup, isPaused: true, pauseReason: reason }
        : state.currentGroup,
      groups: state.groups.map(g => 
        g.id === groupId ? { ...g, isPaused: true, pauseReason: reason } : g
      ),
    }));
  },

  resumeGroup: (groupId: string) => {
    set(state => ({
      currentGroup: state.currentGroup?.id === groupId 
        ? { ...state.currentGroup, isPaused: false, pauseReason: undefined }
        : state.currentGroup,
      groups: state.groups.map(g => 
        g.id === groupId ? { ...g, isPaused: false, pauseReason: undefined } : g
      ),
    }));
  },

  updateGroupSettings: (groupId: string, updates: Partial<ChamaGroup>) => {
    set(state => ({
      currentGroup: state.currentGroup?.id === groupId 
        ? { ...state.currentGroup, ...updates }
        : state.currentGroup,
      groups: state.groups.map(g => 
        g.id === groupId ? { ...g, ...updates } : g
      ),
    }));
  },
}));