import React, { useState, useEffect, FunctionComponent, useRef, useContext, useLayoutEffect, FC } from "react";
import { Text, View, StyleSheet, Switch, TouchableHighlight } from "react-native";
import { Song } from '../../db'
import SideMenu from './components/SideMenu'
import SongRender, { SongRenderRef } from "../../components/SongRender";
import TouchableIcon from "../../components/TouchableIcon";
import Chord from 'chordjs'
import ChordTab from "../../components/ChordTab";
import SongTransformer from "../../components/SongTransformer";
import AutoScrollSlider from "../../components/AutoScrollSlider";
import { RootStackParamList } from "../../AppNavigation";
import SelectPlaylist from "./components/SelectPlaylist"
import PageTurner from "./components/PageTurner";
import LanguageContext from "../../languages/LanguageContext";
import { GlobalSettings } from "../../db/GlobalSettings";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, FONT_SIZE_STEP } from "../Settings/FontSizeSelect";
import clamp from "../../utils/clamp";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SongViewScreenRouteProp = RouteProp<RootStackParamList, 'SongView'>
type SongViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SongView'
>
type Props = {
  route: SongViewScreenRouteProp
  navigation: SongViewScreenNavigationProp;
}
interface ToolButtonProps {
  onPress: () => void
  name: string
}
const ToolButton: FC<ToolButtonProps> = ({ onPress, name }) => (
  <TouchableIcon style={{ borderWidth: 1, borderRadius: 2, marginLeft: 8 }} size={25} onPress={onPress} name={name} />
)
const Divider: FC = () => (
  <View style={{ borderBottomWidth: .5, borderColor: '#00000020' }} />
)
const SongView: FunctionComponent<Props> = (props) => {
  const { navigation } = props
  const songId = props.route.params.id
  const [content, setContent] = useState<string>("")
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const [tone, setTone] = useState<number>(0)
  const [showAutoScrollSlider, setShowAutoScrollSlider] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState<number>(0)
  const [fontSize, setFontSize] = useState<number>(GlobalSettings.get().fontSize)
  const [selectedChord, selectChord] = useState<Chord | null>(null)
  const [showTabs, setShowTabs] = useState(GlobalSettings.get().showTablature)
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false)
  const [showPageTurner, setShowPageTurner] = useState(GlobalSettings.get().enablePageTurner)
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
  function onChangeShowTabs(value: boolean) {
    setShowTabs(value)
    Song.setPreferences(Song.getById(songId)!, { showTablature: value })
  }
  function onClickChord(allChords: Array<Chord>, chordString: string) {
    selectChord(allChords.find(c => c.toString() == chordString)!)
  }
  function editSong() {
    props.navigation.replace('SongEdit', { id: songId })
  }
  function showTone(tone: number) {
    if (tone === 0) return null
    if (tone > 0) return '+' + tone
    return tone
  }
  function onPressArtist() {
    let song = Song.getById(songId)!
    props.navigation.navigate('ArtistView', { id: song.artist.id!, title: song.artist.name })
  }
  function tooglePageTurner(value: boolean) {
    if (value) {
      setShowAutoScrollSlider(false)
      setScrollSpeed(0)
    }
    setShowPageTurner(value)
  }

  useEffect(() => {
    let song = Song.getById(songId)!
    setContent(Song.getChordPro(song))
    setTone(song.transposeAmount ? song.transposeAmount : 0)
    if (song.fontSize != null) {
      setFontSize(song.fontSize)
    }
    if (song.showTablature != null) {
      setShowTabs(song.showTablature)
    }
  }, [])

  useEffect(() => {
    let song = Song.getById(songId)!
    Song.setPreferences(song, { transposeAmount: tone })
  }, [tone])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.flexRow}>
          <TouchableIcon onPress={editSong} name="pencil" />
          <TouchableIcon onPress={openSideMenu} name="settings" />
        </View>
      )
    });
  }, [navigation, isSideMenuOpen]);

  return (
    <>
      <SideMenu isOpen={isSideMenuOpen} onDismiss={() => { setIsSideMenuOpen(false) }}>
        <View style={styles.tool}>
          <View style={styles.toolLabel}>
            <Text style={styles.toolLabelSmall} >{t('transpose')}</Text>
            <Text style={styles.toolBadge}>{showTone(tone)}</Text>
          </View>
          <View style={styles.toolButtonContainer}>
            <ToolButton onPress={transposeDown} name="minus" />
            <ToolButton onPress={transposeUp} name="plus" />
          </View>
        </View>
        <Divider />
        <View style={styles.tool}>
          <View style={styles.toolLabel}>
            <Text style={styles.toolLabelSmall}>{t('text_size')}</Text>
            <Text style={styles.toolBadge}>{fontSize}</Text>
          </View>
          <View style={styles.toolButtonContainer}>
            <ToolButton onPress={decreaseFontSize} name="format-font-size-decrease" />
            <ToolButton onPress={increaseFontSize} name="format-font-size-increase" />
          </View>
        </View>
        <Divider />
        <TouchableHighlight underlayColor='#ccc' onPress={() => {
          setShowPageTurner(false)
          setIsSideMenuOpen(false)
          setShowAutoScrollSlider(true)
        }} style={styles.tool}>
          <Text style={styles.toolLabel}>{t('auto_scroll')}</Text>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight underlayColor='#ccc' onPress={() => onChangeShowTabs(!showTabs)}>
          <View style={styles.tool}>
            <Text style={styles.toolLabel}>{t('show_tabs')}</Text>
            <Switch onValueChange={onChangeShowTabs} value={showTabs} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight underlayColor='#ccc' onPress={() => tooglePageTurner(!showPageTurner)}>
          <View style={styles.tool}>
            <Text style={styles.toolLabel}>{t('page_turner')}</Text>
            <Switch onValueChange={tooglePageTurner} value={showPageTurner} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight underlayColor='#ccc' onPress={() => {
          setIsSideMenuOpen(false)
          setShowPlaylistSelection(!showPlaylistSelection)
        }}>
          <View style={styles.tool}>
            <Text style={styles.toolLabel}>{t('add_to_playlist')}</Text>
            <TouchableIcon
              onPress={() => {
                setIsSideMenuOpen(false)
                setShowPlaylistSelection(!showPlaylistSelection)
              }}
              size={25}
              name="playlist-plus" />
          </View>
        </TouchableHighlight>
      </SideMenu>
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
    </>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  tool: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toolButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolLabelSmall: {
    maxWidth: 100,
    paddingRight: 0,
    textTransform: 'uppercase',
  },
  toolLabel: {
    position: 'relative',
    textAlign: 'left',
    textTransform: 'uppercase',
    paddingVertical: 10,
  },
  toolBadge: {
    position: 'absolute',
    top: -5,
    right: -15,
    width: 30,
    height: 20,
    color: 'tomato'
  },
})
export default SongView