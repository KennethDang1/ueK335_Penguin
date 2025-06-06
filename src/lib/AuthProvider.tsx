import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useContext } from "react";

// Constants
const EMAIL_KEY = "auth_user_email";
const PASSWORD_KEY = "auth_user_password";
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL + "/login";

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  name: string | null;
  email: string;
  id: number;
}

interface AuthSession {
  accessToken: string;
  user: User;
}

interface AuthContextType {
  session: AuthSession | null;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  logout: () => Promise<void>;
  isAuth: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  loginError: Error | null;
}

// API
const loginApi = async (
  credentials: LoginCredentials
): Promise<AuthSession> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate. Please check your credentials.");
  }

  return response.json();
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  // Session query - auto-login with stored credentials
  const {
    data: session,
    isLoading,
    isSuccess,
  } = useQuery<AuthSession | null>({
    queryKey: ["session"],
    queryFn: async () => {
      const email = await SecureStore.getItemAsync(EMAIL_KEY);
      const password = await SecureStore.getItemAsync(PASSWORD_KEY);

      if (!email || !password) return null;

      try {
        return await loginApi({ email, password });
      } catch (error) {
        console.warn(
          "Session refresh failed, clearing stored credentials.",
          error
        );
        await Promise.all([
          SecureStore.deleteItemAsync(EMAIL_KEY),
          SecureStore.deleteItemAsync(PASSWORD_KEY),
        ]);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Login mutation
  const {
    mutateAsync: loginMutation,
    isPending: isLoggingIn,
    error: loginError,
    reset: resetLoginMutation,
  } = useMutation<AuthSession, Error, LoginCredentials>({
    mutationFn: loginApi,
    onSuccess: async (newSession, variables) => {
      await SecureStore.setItemAsync(EMAIL_KEY, variables.email);
      await SecureStore.setItemAsync(PASSWORD_KEY, variables.password);
      queryClient.setQueryData(["session"], newSession);
    },
  });

  // Logout mutation
  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await SecureStore.deleteItemAsync(EMAIL_KEY);
      await SecureStore.deleteItemAsync(PASSWORD_KEY);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  const value: AuthContextType = {
    session: session || null,
    isAuth: isSuccess && !!session,
    isLoading,
    isLoggingIn,
    isLoggingOut,
    loginError,
    login: async (credentials) => {
      if (loginError) resetLoginMutation();
      return loginMutation(credentials);
    },
    logout: () => logoutMutation(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
