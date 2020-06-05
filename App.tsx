import React, { useContext, useEffect } from "react";
import AppNavigation from './app/AppNavigation'
import { createAppContainer } from "react-navigation";
import LanguageContext, { LanguageProvider } from "./app/languages/LanguageContext";
import { GlobalSettings } from "./app/db/GlobalSettings";

const AppContainer = createAppContainer(AppNavigation);

const LoadLanguage = () => {
  const { changeLanguage } = useContext(LanguageContext)
  useEffect(() => {
    let { language } = GlobalSettings.get()
    changeLanguage(language)
  }, [])
  return null
}

export default class App extends React.Component {
  render() {
    return (
      <LanguageProvider>
        <LoadLanguage />
        <AppContainer />
      </LanguageProvider>
    );
  }
}