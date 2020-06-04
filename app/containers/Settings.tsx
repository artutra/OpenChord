import React, { useState, useEffect, FunctionComponent, FC, useContext } from "react";
import { NavigationScreenComponent } from "react-navigation"
import { createBundle, importBundle, decodeJsonBundle } from '../db/bundler'
import ListItem from "../components/ListItem";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import { StyleSheet, View, Alert, Platform, Picker } from "react-native";
import Share from 'react-native-share';
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import LoadingIndicator from "../components/LoadingIndicator";
import createFile from "../utils/createFile";
import { PermissionsAndroid } from 'react-native';
import pad from "../utils/pad";
import LanguageContext, { languages, translations } from "../languages/LanguageContext";

const Settings: FunctionComponent & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = () => {
  const [loading, setLoading] = useState(false)
  const { t, changeLanguage, language } = useContext(LanguageContext)

  async function requestWritePermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Open Chord App Storage Permission',
        message:
          'Open Chord App needs access to your storage ' +
          'so you can save your backups.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can write on the external storage');
    } else {
      throw new Error('Write store permission denied')
    }
  }

  async function onPressExport() {
    if (loading) return
    setLoading(true)
    try {
      if (Platform.OS === 'android') {
        let hasPermission = await PermissionsAndroid
          .check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        if (!hasPermission) {
          await requestWritePermission()
        }
      }
      let bundle = createBundle()
      let bundleString = JSON.stringify(bundle)
      let today = new Date()
      let day = pad(today.getDate())
      let month = pad(today.getMonth() + 1)
      let year = today.getFullYear()
      let path = await createFile(`backup-${year}_${month}_${day}`, bundleString)
      if (Platform.OS === 'android') {
        Alert.alert('Success', 'Backup saved at: ' + path)
      } else {
        await Share.open({ url: "file://" + path })
      }
    } catch (err) {
      Alert.alert('Error', err.message)
      console.warn(err.message)
    }
    setLoading(false)
  }

  async function onPressImport() {
    if (loading) return
    setLoading(true)
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      let success = await RNFS.readFile(res.uri, 'utf8')
      let bundle = await decodeJsonBundle(success)
      importBundle(bundle)
      Alert.alert('Info', 'Songs imported successfully')
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <ListItem onPress={onPressExport} title={t('create_backup')} subtitle={t('create_backup_description')} />
      <ListItem onPress={onPressImport} title={t('import')} subtitle={t('import_description')} />
      <LoadingIndicator loading={loading} />
      <Picker
        selectedValue={language}
        onValueChange={(value) => changeLanguage(value)}>
        {languages.map(l => {
          return <Picker.Item key={l} label={translations[l].language_name} value={l} />
        })}
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Settings