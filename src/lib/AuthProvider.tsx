import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const EMAIL_KEY = "auth_user_email";
const PASSWORD_KEY = "auth_user_password";

// --- Auth Context Definition ---
interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  setAuth: (email: string, password: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  getAuth: () => Promise<{ email: string; password: string } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const email = await SecureStore.getItemAsync(EMAIL_KEY);
        if (email) {
          setIsAuth(true);
        }
      } catch (error) {
        console.error(
          "AuthProvider: Failed to load auth status from secure store.",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const setAuth = async (email: string, password: string) => {
    try {
      await SecureStore.setItemAsync(EMAIL_KEY, email);
      await SecureStore.setItemAsync(PASSWORD_KEY, password);
      setIsAuth(true);
    } catch (error) {
      console.error(
        "AuthProvider: Failed to save auth data to secure store.",
        error
      );
      throw error; // Re-throw to allow UI to handle it
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStore.deleteItemAsync(EMAIL_KEY);
      await SecureStore.deleteItemAsync(PASSWORD_KEY);
      setIsAuth(false);
    } catch (error) {
      console.error(
        "AuthProvider: Failed to clear auth data from secure store.",
        error
      );
      throw error; // Re-throw
    }
  };

  const getAuth = async (): Promise<{
    email: string;
    password: string;
  } | null> => {
    try {
      const email = await SecureStore.getItemAsync(EMAIL_KEY);
      const password = await SecureStore.getItemAsync(PASSWORD_KEY);

      if (email && password) {
        return { email, password };
      }
      return null;
    } catch (error) {
      console.error(
        "AuthProvider: Failed to get auth data from secure store.",
        error
      );
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, isLoading, setAuth, clearAuth, getAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- useAuth Hook ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
