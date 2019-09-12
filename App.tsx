import React from "react";
import AppNavigation from './app/AppNavigation'
import { createAppContainer } from "react-navigation";

const AppContainer = createAppContainer(AppNavigation);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}