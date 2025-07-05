import React, { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  verified?: boolean; // Add verification status for agents
  company_name?: string; // Add company name for agents
  contact_phone?: string; // Add contact phone for agents
}

interface DemoUser {
  role: string;
  name: string;
  verified: boolean;
  company_name?: string;
  contact_phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string, userType?: 'customer' | 'agency') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  userRole: string | null;
  updateUserVerification: (userId: string, verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: 'Not implemented' }),
  signUp: async () => ({ error: 'Not implemented' }),
  signOut: async () => {},
  userRole: null,
  updateUserVerification: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('auth_user');
    const savedRole = localStorage.getItem('auth_role');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setUserRole(savedRole);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_role');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Demo users for testing with verification status
      const demoUsers: Record<string, DemoUser> = {
        'customer@demo.com': { 
          role: 'customer', 
          name: 'Demo Customer',
          verified: true 
        },
        'agency@demo.com': { 
          role: 'agency', 
          name: 'Demo Agency',
          verified: true,
          company_name: 'Mountain Explorers',
          contact_phone: '+91 8438327763'
        },
        'unverified@demo.com': { 
          role: 'agency', 
          name: 'Unverified Agency',
          verified: false,
          company_name: 'New Travel Agency',
          contact_phone: '+91 9876543210'
        },
        'admin@demo.com': { 
          role: 'admin', 
          name: 'Demo Admin',
          verified: true 
        }
      };

      if (password === 'password' && email in demoUsers) {
        const demoUser = demoUsers[email];
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: demoUser.name,
          verified: demoUser.verified,
          company_name: demoUser.company_name,
          contact_phone: demoUser.contact_phone
        };
        
        setUser(user);
        setUserRole(demoUser.role);
        
        // Save to localStorage
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_role', demoUser.role);
        
        return {};
      } else {
        return { error: 'Invalid login credentials' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name?: string, userType: 'customer' | 'agency' = 'customer') => {
    try {
      // Simple validation
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      // Create new user with verification status
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: name || '',
        verified: userType === 'customer' ? true : false, // Customers are auto-verified, agents need verification
        company_name: userType === 'agency' ? name : undefined,
        contact_phone: undefined
      };
      
      setUser(user);
      setUserRole(userType);
      
      // Save to localStorage
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_role', userType);
      
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_role');
  };

  const updateUserVerification = (userId: string, verified: boolean) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, verified };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, userRole, updateUserVerification }}>
      {children}
    </AuthContext.Provider>
  );
};
