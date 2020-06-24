import React, { useState, FC, useContext, useCallback } from "react";
import { createBundle, importBundle, decodeJsonBundle } from '../../db/bundler'
import ListItem from "../../components/ListItem";
import { StyleSheet, Alert, Platform, ScrollView } from "react-native";
import Share from 'react-native-share';
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import LoadingIndicator from "../../components/LoadingIndicator";
import createFile from "../../utils/createFile";
import { PermissionsAndroid } from 'react-native';
import pad from "../../utils/pad";
import LanguageContext, { languages, translations, LanguageID } from "../../languages/LanguageContext";
import { GlobalSettings } from "../../db/GlobalSettings";
import PickerModal from "../../components/PickerModal";
import { SettingsStackParamList } from "../../AppNavigation";
import AboutDev from "./components/AboutDev";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SettingsScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'Settings'
>
type Props = {
  navigation: SettingsScreenNavigationProp
}
const Settings: FC<Props> = (props) => {
  const [loading, setLoading] = useState(false)
  const [activeLanguageSelect, setActiveLanguageSelect] = useState(false)
  const [activeShowTablatureSelect, setActiveShowTablatureSelect] = useState(false)
  const [activeEnablePageTurnerSelect, setActiveEnablePageTurnerSelect] = useState(false)
  const [fontSize, setFontSize] = useState(GlobalSettings.get().fontSize)
  const [showTablature, setShowTablature] = useState(GlobalSettings.get().showTablature)
  const [enablePageTurner, setEnablePageTurner] = useState(GlobalSettings.get().enablePageTurner)
  const { t, changeLanguage, language } = useContext(LanguageContext)
  const showTablatureOptions = [
    { key: 'default-show-true', label: t('show_tabs_by_default'), value: true },
    { key: 'default-show-false', label: t('hide_tabs_by_default'), value: false },
  ]
  const enablePageTurnerOptions = [
    { key: 'page-turner-true', label: t('enable_page_turner_by_default'), value: true },
    { key: 'page-turner-false', label: t('disable_page_turner_by_default'), value: false },
  ]

  async function requestWritePermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: t('permission_title'),
        message: t('permission_message'),
        buttonNegative: t('permission_button_negative'),
        buttonPositive: t('permission_button_positive')
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can write on the external storage');
    } else {
      throw new Error(t('permission_denied'))
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
      let path = await createFile('downloads', `backup-${year}_${month}_${day}`, bundleString)
      if (Platform.OS === 'android') {
        Alert.alert(t('success'), t('backup_saved_at_path') + ': ' + path)
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
      let type = [DocumentPicker.types.allFiles]
      if (Platform.OS === 'ios') {
        const iosAllFileTypes: any = 'public.item'
        type = [iosAllFileTypes]
      }
      const res = await DocumentPicker.pick({ type });
      let success = await RNFS.readFile(res.uri, 'utf8')
      let bundle = await decodeJsonBundle(success)
      importBundle(bundle)
      Alert.alert(t('info'), t('songs_imported_successfully'))
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (err instanceof Error) {
        Alert.alert(t('error'), t('invalid_file'))
      }
    }
    setLoading(false)
  }

  function onChangeLanguage(value: LanguageID) {
    GlobalSettings.setLanguage(value)
    changeLanguage(value)
  }
  function onChangeShowTablature(value: boolean) {
    GlobalSettings.setShowTablature(value)
    setShowTablature(value)
  }
  function onChangeEnablePageTurner(value: boolean) {
    GlobalSettings.setEnablePageTurner(value)
    setEnablePageTurner(value)
  }
  function configureFontSize() {
    props.navigation.navigate('FontSizeSelect')
  }

  useFocusEffect(
    useCallback(() => {
      setFontSize(GlobalSettings.get().fontSize)
    }, [])
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <ListItem onPress={onPressExport} title={t('create_backup')} subtitle={t('create_backup_description')} />
        <ListItem onPress={onPressImport} title={t('import')} subtitle={t('import_description')} />
        <ListItem onPress={() => setActiveLanguageSelect(true)} title={t('language')} subtitle={t('language_name')} />
        <ListItem onPress={configureFontSize} title={t('text_size')} subtitle={fontSize.toString()} />
        <ListItem
          onPress={() => setActiveShowTablatureSelect(true)}
          title={showTablatureOptions.find(o => o.value === showTablature)!.label}
        />
        <ListItem
          onPress={() => setActiveEnablePageTurnerSelect(true)}
          title={enablePageTurnerOptions.find(o => o.value === enablePageTurner)!.label}
        />
        <LoadingIndicator loading={loading} />
        <AboutDev />
      </ScrollView>
      <PickerModal
        show={activeLanguageSelect}
        onChange={onChangeLanguage}
        onDismiss={() => setActiveLanguageSelect(false)}
        value={language}
        options={languages.map(l => ({
          key: 'lang-option-' + l,
          label: translations[l].language_name,
          description: translations[l].language_english_name,
          value: l
        }))}
      />
      <PickerModal
        show={activeShowTablatureSelect}
        onChange={onChangeShowTablature}
        onDismiss={() => setActiveShowTablatureSelect(false)}
        value={showTablature}
        options={showTablatureOptions}
      />
      <PickerModal
        show={activeEnablePageTurnerSelect}
        onChange={onChangeEnablePageTurner}
        onDismiss={() => setActiveEnablePageTurnerSelect(false)}
        value={enablePageTurner}
        options={enablePageTurnerOptions}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Settings