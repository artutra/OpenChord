import React, { useState, useEffect, FunctionComponent, useRef, useContext } from "react";
import { Text, View, StyleSheet, Alert, Switch, Slider, TouchableOpacity } from "react-native";
import { Song } from '../../db'
import { NavigationScreenComponent } from "react-navigation";
import SideMenu from 'react-native-side-menu'
import SongRender, { SongRenderRef } from "../../components/SongRender";
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
import SelectPlaylist from "./components/SelectPlaylist"
import PageTurner from "./components/PageTurner";
import LanguageContext from "../../languages/LanguageContext";
import { GlobalSettings } from "../../db/GlobalSettings";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, FONT_SIZE_STEP } from "../Settings/FontSizeSelect";
import clamp from "../../utils/clamp";

export type SongViewParams = { id: string, title: string, openSideMenu?: () => void }

type Props = {
  navigation: NavigationStackProp<{}, SongViewParams>
}

const SongView: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const songId = props.navigation.getParam('id')
  const [content, setContent] = useState<string>("")
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const [tone, setTone] = useState<number>(0)
  const [showAutoScrollSlider, setShowAutoScrollSlider] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState<number>(0)
  const [fontSize, setFontSize] = useState<number>(GlobalSettings.get().fontSize)
  const [selectedChord, selectChord] = useState<Chord | null>(null)
  const [showTabs, setShowTabs] = useState(true)
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false)
  const [showPageTurner, setShowPageTurner] = useState(false)
  const songRenderRef = useRef<SongRenderRef>(null)
  const { t } = useContext(LanguageContext)

  function transposeUp() { setTone(tone + 1 >= 12 ? 0 : tone + 1); selectChord(null) }
  function transposeDown() { setTone(tone - 1 <= -12 ? 0 : tone - 1); selectChord(null) }
  function changeFontSize(amount: number) {
    let newFontSize = clamp(fontSize + amount, MIN_FONT_SIZE, MAX_FONT_SIZE)
    setFontSize(newFontSize)
    Song.setPreferences(Song.getById(songId)!, { fontSize: newFontSize })
  }
  function increaseFontSize() { changeFontSize(FONT_SIZE_STEP) }
  function decreaseFontSize() { changeFontSize(-FONT_SIZE_STEP) }
  function openSideMenu() { setIsSideMenuOpen(!isSideMenuOpen) }
  function onPressNextPage() { if (songRenderRef.current) songRenderRef.current.nextPage() }
  function onPressPreviousPage() { if (songRenderRef.current) songRenderRef.current.previousPage() }

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
  function tooglePageTurner(value: boolean) {
    if (value) {
      setShowAutoScrollSlider(false)
      setScrollSpeed(0)
    }
    setShowPageTurner(value)
  }

  useEffect(() => {
    let id = props.navigation.getParam('id')
    let song = Song.getById(id)!
    setContent(Song.getChordPro(song))
    setTone(song.transposeAmount ? song.transposeAmount : 0)
    setFontSize(song.fontSize != null ? song.fontSize : fontSize)
    setShowTabs(song.showTablature)
  }, [])

  useEffect(() => {
    let song = Song.getById(songId)!
    Song.setPreferences(song, { showTablature: showTabs, transposeAmount: tone })
  }, [showTabs, tone])

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
                setShowPageTurner(false)
                setIsSideMenuOpen(false)
                setShowAutoScrollSlider(true)
              }}>
                <Text style={styles.toolLabel}>{t('auto_scroll')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tool}>
              <Switch onValueChange={setShowTabs} value={showTabs} />
              <Text style={styles.toolLabel}>{t('show_tabs')}</Text>
            </View>
            <View style={styles.tool}>
              <Switch onValueChange={tooglePageTurner} value={showPageTurner} />
              <Text style={styles.toolLabel}>{t('page_turner')}</Text>
            </View>
            <View style={styles.tool}>
              <TouchableIcon
                onPress={() => {
                  setIsSideMenuOpen(false)
                  setShowPlaylistSelection(!showPlaylistSelection)
                }}
                size={25}
                name="playlist-plus" />
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
              ref={songRenderRef}
              onPressArtist={onPressArtist}
              onPressChord={(chordString) => onClickChord(songProps.chords, chordString)}
              chordProContent={songProps.htmlSong}
              scrollSpeed={scrollSpeed}
            />
            <ChordTab
              onPressClose={() => selectChord(null)}
              selectedChord={selectedChord}
              allChords={songProps.chords}
              closeLabel={t('close')}
            />
            <AutoScrollSlider
              show={showAutoScrollSlider}
              onValueChange={setScrollSpeed}
              onClose={() => setShowAutoScrollSlider(false)}
            />
            <SelectPlaylist
              songId={songId}
              show={showPlaylistSelection}
              onPressClose={() => setShowPlaylistSelection(false)}
            />
            <PageTurner
              show={showPageTurner}
              onPressNext={onPressNextPage}
              onPressPrevious={onPressPreviousPage}
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