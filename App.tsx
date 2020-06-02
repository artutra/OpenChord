import React from "react";
import AppNavigation from './app/AppNavigation'
import { createAppContainer } from "react-navigation";
import { LanguageProvider } from "./app/languages/LanguageContext";

const AppContainer = createAppContainer(AppNavigation);

export default class App extends React.Component {
  render() {
    return (
      <LanguageProvider>
        <AppContainer />
      </LanguageProvider>
    );
  }
}