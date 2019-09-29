import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Song } from '../db'
import { NavigationScreenComponent } from "react-navigation";
import SideMenu from 'react-native-side-menu'
import SongRender from "../components/SongRender";
import TouchableIcon from "../components/TouchableIcon";
import { NavigationStackOptions, NavigationStackProp, } from "react-navigation-stack/lib/typescript/types";
import ChordSheetJS, { Song as ChordSheetSong } from 'chordsheetjs'
import Chord from 'chordjs'
import ChordTab from "../components/ChordTab";

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
  const [chords, setChords] = useState<Array<Chord>>([])
  const [selectedChord, selectChord] = useState<Chord | null>(null)

  function transposeUp() { setTone(tone + 1 >= 12 ? 0 : tone + 1) }
  function transposeDown() { setTone(tone - 1 <= -12 ? 0 : tone - 1) }
  function openSideMenu() { setIsSideMenuOpen(!isSideMenuOpen) }

  function onClickChord(chord: string) {
    selectChord(chords.find(c => c.toString() == chord)!)
  }

  useEffect(() => {
    let id = props.navigation.getParam('id')
    let song = Song.getById(id)!
    setContent(song.content)
  }, [])

  useEffect(() => {
    const chordSheetSong = new ChordSheetJS.ChordProParser().parse(content);
    let allChords = Array<Chord>()
    chordSheetSong.lines.forEach(line => {
      line.items.forEach(item => {
        if (item instanceof ChordSheetJS.ChordLyricsPair && item.chords) {
          const parsedChord = Chord.parse(item.chords);
          if (allChords.find(c => c.toString() == parsedChord.toString()) == null) {
            allChords.push(parsedChord)
          }
        }
      });
    })
    setChords(allChords)
  }, [content, tone])

  useEffect(() => {
    props.navigation.setParams({ 'openSideMenu': openSideMenu })
  }, [isSideMenuOpen])

  return (
    <SideMenu
      menu={
        <View style={styles.sideMenuContainer}>
          <View style={styles.toolbarContainer}>
            <TouchableIcon onPress={transposeUp} name="plus" />
            <Text>{tone}</Text>
            <TouchableIcon onPress={transposeDown} name="minus" />
          </View>
        </View>
      }
      onChange={(isOpen) => { setIsSideMenuOpen(isOpen) }}
      openMenuOffset={50}
      isOpen={isSideMenuOpen}
      menuPosition="right"
      disableGestures={true}
    >
      <SongRender
        onPressChord={onClickChord}
        chordProContent={content}
        tone={tone}
      />
      <ChordTab
        onPressClose={() => selectChord(null)}
        selectedChord={selectedChord}
        allChords={chords}
      />
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
    flex: 1
  },
  toolbarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc'
  }
})
export default SongView