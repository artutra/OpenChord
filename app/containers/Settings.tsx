import React, { useState, useEffect, FunctionComponent, FC } from "react";
import { NavigationScreenComponent } from "react-navigation"
import { createBundle, importBundle, decodeJsonBundle } from '../db/bundler'
import ListItem from "../components/ListItem";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import { StyleSheet, View, Alert } from "react-native";
import Share from 'react-native-share';
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import LoadingIndicator from "../components/LoadingIndicator";
import createFile from "../utils/createFile";

const Settings: FC & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = () => {
  const [loading, setLoading] = useState(false)

  async function onPressExport() {
    if (loading) return
    setLoading(true)
    try {
      let bundle = createBundle()
      let bundleString = JSON.stringify(bundle)
      let path = await createFile('backup', bundleString)
      await Share.open({ url: "file://" + path })
    } catch (err) {
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
      <ListItem onPress={onPressExport} title="Create Backup" subtitle="Pack all songs and playlists into a .openchord file" />
      <ListItem onPress={onPressImport} title="Import" subtitle="Backups, Playlists and .openchord files" />
      <LoadingIndicator loading={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Settings