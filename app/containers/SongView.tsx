import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, StyleSheet, Alert, Switch } from "react-native";
import { Song } from '../db'
import { NavigationScreenComponent } from "react-navigation";
import SideMenu from 'react-native-side-menu'
import SongRender from "../components/SongRender";
import TouchableIcon from "../components/TouchableIcon";
import { NavigationStackOptions, NavigationStackProp, } from "react-navigation-stack/lib/typescript/types";
import Chord from 'chordjs'
import ChordTab from "../components/ChordTab";
import SongTransformer from "../components/SongTransformer";

type Params = { id: string, title: string, openSideMenu: () => void }

type Props = {
  navigation: NavigationStackProp<{}, Params>
}

const SongView: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const [content, setContent] = useState<string>("")
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const [tone, setTone] = useState<number>(0)
  const [fontSize, setFontSize] = useState<number>(14)
  const [selectedChord, selectChord] = useState<Chord | null>(null)
  const [showTabs, setShowTabs] = useState(true)

  function transposeUp() { setTone(tone + 1 >= 12 ? 0 : tone + 1); selectChord(null) }
  function transposeDown() { setTone(tone - 1 <= -12 ? 0 : tone - 1); selectChord(null) }
  function increaseFontSize() { setFontSize(fontSize + 2 >= 24 ? 24 : fontSize + 2) }
  function decreaseFontSize() { setFontSize(fontSize - 2 <= 14 ? 14 : fontSize - 2) }
  function openSideMenu() { setIsSideMenuOpen(!isSideMenuOpen) }

  function onClickChord(allChords: Array<Chord>, chordString: string) {
    selectChord(allChords.find(c => c.toString() == chordString)!)
  }
  function editSong() {
    props.navigation.navigate('SongEdit', { id: props.navigation.getParam('id') })
  }
  function removeSong() {
    Alert.alert(
      'Delete Song',
      'Are you sure you want to permanently delete this song?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => { } },
        {
          text: 'Yes', onPress: () => {
            Song.delete(props.navigation.getParam('id'))
            props.navigation.goBack()
          }
        },
      ],
      { cancelable: true }
    )
  }

  useEffect(() => {
    let id = props.navigation.getParam('id')
    let song = Song.getById(id)!
    setContent(song.content)
  }, [])

  useEffect(() => {
    props.navigation.setParams({ 'openSideMenu': openSideMenu })
  }, [isSideMenuOpen])

  return (
    <SideMenu
      menu={
        <View style={styles.sideMenuContainer}>
          <View style={styles.toolbarContainer}>
            <View style={styles.tool}>
              <TouchableIcon size={25} onPress={transposeUp} name="plus" />
              <Text>{tone}</Text>
              <TouchableIcon size={25} onPress={transposeDown} name="minus" />
            </View>
            <View style={styles.tool}>
              <TouchableIcon size={25} onPress={increaseFontSize} name="format-font-size-increase" />
              <TouchableIcon size={25} onPress={decreaseFontSize} name="format-font-size-decrease" />
            </View>
            <View style={styles.tool}>
              <Switch onValueChange={setShowTabs} value={showTabs} />
              <Text style={styles.toolLabel}>Show Tabs</Text>
            </View>
          </View>
          <View style={styles.secondaryToolbarContainer}>
            <TouchableIcon onPress={editSong} name="pencil" />
            <TouchableIcon style={styles.deleteButton} onPress={removeSong} name="trash-can" color="white" size={20} />
          </View>
        </View>
      }
      onChange={(isOpen) => { setIsSideMenuOpen(isOpen) }}
      openMenuOffset={50}
      isOpen={isSideMenuOpen}
      menuPosition="right"
      disableGestures={true}
    >
      <SongTransformer
        chordProSong={content}
        transposeDelta={tone}
        showTabs={showTabs}
        fontSize={fontSize}
      >
        {songProps => (
          <View style={{ flex: 1 }}>
            <SongRender
              onPressChord={(chordString) => onClickChord(songProps.chords, chordString)}
              chordProContent={songProps.htmlSong}
            />
            <ChordTab
              onPressClose={() => selectChord(null)}
              selectedChord={selectedChord}
              allChords={songProps.chords}
            />
          </View>
        )}
      </SongTransformer>
    </SideMenu>
  );
}

SongView.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('title'),
    headerRight: <TouchableIcon onPress={navigation.getParam('openSideMenu')} name="settings" />,
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    backgroundColor: '#eee',
    flex: 1,
    justifyContent: 'space-between',
  },
  toolbarContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  tool: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 5,
  },
  toolLabel: {
    textAlign: 'center'
  },
  secondaryToolbarContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 3,
    margin: 5
  }
})
export default SongView