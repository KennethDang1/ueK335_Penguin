import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LandingPage from "./screens/LandingPage";

const Tab = createBottomTabNavigator();

export function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={LandingPage} />
    </Tab.Navigator>
  );
}
