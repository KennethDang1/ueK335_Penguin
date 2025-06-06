import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./lib/AuthProvider";

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <PaperProvider>{children}</PaperProvider>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Providers;
