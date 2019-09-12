import React from "react";
import { createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import Home from './containers/Home'

const AppNavigation = createStackNavigator({
  Home
});

export default AppNavigation;