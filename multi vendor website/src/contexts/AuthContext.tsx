import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'merchant' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isApproved?: boolean; // For merchants
  storeName?: string; // For merchants
  storeDescription?: string; // For merchants
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    storeName?: string;
    storeDescription?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@vendorverse.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'merchant@example.com',
    name: 'John Smith',
    role: 'merchant',
    isApproved: true,
    storeName: 'Tech Haven',
    storeDescription: 'Your one-stop shop for all tech gadgets',
  },
  {
    id: '3',
    email: 'customer@example.com',
    name: 'Jane Doe',
    role: 'customer',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vendorverse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('vendorverse_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vendorverse_user');
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    storeName?: string;
    storeDescription?: string;
  }) => {
    setIsLoading(true);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isApproved: userData.role === 'merchant' ? false : undefined,
      storeName: userData.storeName,
      storeDescription: userData.storeDescription,
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('vendorverse_user', JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};