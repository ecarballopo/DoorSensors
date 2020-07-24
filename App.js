import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Dashboard from "./src/components/Dashboard";

const LoginNavigator = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      title: "DoorSensor",
    },
  },
});

export default createAppContainer(LoginNavigator);
