import React, { useContext } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native'
import LanguageContext from '../../../languages/LanguageContext'

const AboutDev = () => {
  const { t } = useContext(LanguageContext)

  async function goToDevURL() {
    try {
      await Linking.openURL('https://github.com/artutra')
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.lightGray}>{t('developed_by')} </Text>
      <TouchableOpacity onPress={goToDevURL} style={styles.devButton}>
        <Text style={styles.primaryColor}>Artur Miranda</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  devButton: {
    paddingVertical: 20
  },
  lightGray: {
    color: '#888'
  },
  primaryColor: {
    color: 'tomato'
  }
})
export default AboutDev