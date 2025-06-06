import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./lib/AuthProvider";

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  return (
    <AuthProvider>
      <NavigationContainer>
        <PaperProvider>{children}</PaperProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default Providers;
