import React from "react";
import AppNavigation from './app/AppNavigation'
import { createAppContainer } from "react-navigation";

const nav: any = AppNavigation
const AppContainer = createAppContainer(nav);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}