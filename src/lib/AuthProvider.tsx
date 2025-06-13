import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useContext } from "react";

// Constants
const EMAIL_KEY = "auth_user_email";
const PASSWORD_KEY = "auth_user_password";
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL + "/login";
const API_Register = process.env.EXPO_PUBLIC_API_BASE_URL + "/users";

// Types
/**
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @property {string | null} name - The user's name.
 * @property {string} email - The user's email address.
 * @property {number} id - The user's unique ID.
 */
interface User {
  name: string | null;
  email: string;
  id: number;
}

/**
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * @property {string} accessToken - The access token for the session.
 * @property {User} user - The user associated with the session.
 */
interface AuthSession {
  accessToken: string;
  user: User;
}

/**
 * Provides session data and authentication functions.
 */
interface AuthContextType {
  session: AuthSession | null;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<AuthSession>;
  isAuth: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  loginError: Error | null;
  isRegistering: boolean;
}

/**
 * @param {LoginCredentials} credentials - The login credentials (email and password).
 */
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

/**
 * @param {RegisterCredentials} credentials - The registration credentials (name, email, and password).
 */
const registerApi = async (
  credentials: RegisterCredentials
): Promise<AuthSession> => {
  const response = await fetch(API_Register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Registration error:", data);
    throw new Error(
      data?.message || "Failed to register. Please check your details."
    );
  }

  return data;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @property {ReactNode} children - The child components to be rendered within the provider's scope.
 */
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: registerMutation,
    isPending: isRegistering,
    error: registerError,
  } = useMutation<AuthSession, Error, RegisterCredentials>({
    mutationFn: registerApi,
    onSuccess: async (newSession, variables) => {
      await SecureStore.setItemAsync(EMAIL_KEY, variables.email);
      await SecureStore.setItemAsync(PASSWORD_KEY, variables.password);
      queryClient.setQueryData(["session"], newSession);
    },
  });

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
    loginError,
    isLoggingOut,
    isRegistering,
    register: async (credentials) => {
      return registerMutation(credentials);
    },
    login: async (credentials) => {
      if (loginError) resetLoginMutation();
      return loginMutation(credentials);
    },
    logout: () => logoutMutation(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
