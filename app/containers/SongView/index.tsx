import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, StyleSheet, Alert, Switch, Slider, TouchableOpacity } from "react-native";
import { Song } from '../../db'
import { NavigationScreenComponent } from "react-navigation";
import SideMenu from 'react-native-side-menu'
import SongRender from "../../components/SongRender";
import TouchableIcon from "../../components/TouchableIcon";
import { NavigationStackOptions, NavigationStackProp, } from "react-navigation-stack/lib/typescript/types";
import Chord from 'chordjs'
import ChordTab from "../../components/ChordTab";
import SongTransformer from "../../components/SongTransformer";
import AutoScrollSlider from "../../components/AutoScrollSlider";
import { removeSong } from "../../utils/removeSong";
import { ROUTES } from "../../AppNavigation";
import { ArtistViewParams } from "./../ArtistView";
import { SongEditParams } from "./../SongEdit";

export type SongViewParams = { id: string, title: string, openSideMenu?: () => void }

type Props = {
  navigation: NavigationStackProp<{}, SongViewParams>
}

const SongView: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const DEFAULT_FONT_SIZE = 14
  const songId = props.navigation.getParam('id')
  const [content, setContent] = useState<string>("")
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const [tone, setTone] = useState<number>(0)
  const [showAutoScrollSlider, setShowAutoScrollSlider] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState<number>(0)
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE)
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
    let params: SongEditParams = { id: props.navigation.getParam('id') }
    props.navigation.replace(ROUTES.SongEdit, params)
  }
  function onPressRemoveSong() {
    let id = props.navigation.getParam('id')
    removeSong(id, () => {
      props.navigation.goBack()
    })
  }
  function onPressArtist() {
    let id = props.navigation.getParam('id')
    let song = Song.getById(id)!
    let params: ArtistViewParams = { id: song.artist.id!, title: song.artist.name }
    props.navigation.navigate(ROUTES.ArtistView, params)
  }

  useEffect(() => {
    let id = props.navigation.getParam('id')
    let song = Song.getById(id)!
    setContent(Song.getChordPro(song))
    setTone(song.transposeAmount ? song.transposeAmount : 0)
    setFontSize(song.fontSize ? song.fontSize : DEFAULT_FONT_SIZE)
    setShowTabs(song.showTablature)
  }, [])

  useEffect(() => {
    let song = Song.getById(songId)!
    Song.setPreferences(song, { fontSize, showTablature: showTabs, transposeAmount: tone })
  }, [fontSize, showTabs, tone])

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
              <TouchableOpacity onPress={() => {
                setIsSideMenuOpen(false)
                setShowAutoScrollSlider(true)
              }}>
                <Text style={styles.toolLabel}>Auto Scroll</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tool}>
              <Switch onValueChange={setShowTabs} value={showTabs} />
              <Text style={styles.toolLabel}>Show Tabs</Text>
            </View>
          </View>
          <View style={styles.secondaryToolbarContainer}>
            <TouchableIcon onPress={editSong} name="pencil" />
            <TouchableIcon
              style={styles.deleteButton}
              onPress={onPressRemoveSong}
              name="trash-can"
              color="white"
              size={20}
            />
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
              onPressArtist={onPressArtist}
              onPressChord={(chordString) => onClickChord(songProps.chords, chordString)}
              chordProContent={songProps.htmlSong}
              scrollSpeed={scrollSpeed}
            />
            <ChordTab
              onPressClose={() => selectChord(null)}
              selectedChord={selectedChord}
              allChords={songProps.chords}
            />
            <AutoScrollSlider
              show={showAutoScrollSlider}
              onValueChange={setScrollSpeed}
              onClose={() => setShowAutoScrollSlider(false)}
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