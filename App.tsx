import 'react-native-gesture-handler';
import React, { useContext, useEffect } from "react";
import AppNavigation from './app/AppNavigation'
import { NavigationContainer } from '@react-navigation/native';
import LanguageContext, { LanguageProvider } from "./app/languages/LanguageContext";
import { GlobalSettings } from "./app/db/GlobalSettings";

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
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </LanguageProvider>
    );
  }
}