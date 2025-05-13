
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage (simulating persistence)
    const storedUser = localStorage.getItem("secureVault_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // For demo purposes, we're simulating auth. In production, this would use AWS Cognito
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo login - in real app, this would validate with Cognito
      if (email && password) {
        const newUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0]
        };
        
        setUser(newUser);
        localStorage.setItem("secureVault_user", JSON.stringify(newUser));
        toast({
          title: "Login successful",
          description: "Welcome back to SecureVault!",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo signup - in real app, this would create account with Cognito
      if (email && password && name) {
        const newUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          name
        };
        
        setUser(newUser);
        localStorage.setItem("secureVault_user", JSON.stringify(newUser));
        toast({
          title: "Account created successfully",
          description: "Welcome to SecureVault!",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "Please fill all required fields",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "An error occurred during signup",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("secureVault_user");
    localStorage.removeItem("secureVault_vault");
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
