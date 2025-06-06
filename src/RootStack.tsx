import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  CustomNavigationBar,
  DetailsScreen,
  HomeScreen,
} from "./screens/screens";
const Stack = createNativeStackNavigator();

export function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
