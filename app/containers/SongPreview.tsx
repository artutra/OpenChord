import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import SongRender from "../components/SongRender";
import SongTransformer from "../components/SongTransformer";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChordSheetJS from 'chordsheetjs';
import { Artist, Song } from "../db";
import { RootStackParamList } from "../AppNavigation";
import LoadingIndicator from "../components/LoadingIndicator";
import LanguageContext from "../languages/LanguageContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import CifraboxService from "../services/CifraboxService";

type SongPreviewScreenRouteProp = RouteProp<RootStackParamList, 'SongPreview'>;
type SongPreviewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SongPreview'
>;

type Props = {
  route: SongPreviewScreenRouteProp
  navigation: SongPreviewScreenNavigationProp;
}
const SongPreview: FunctionComponent<Props> = (props) => {
  const [chordSheet, setChordCheet] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useContext(LanguageContext)
  let slug = props.route.params.slug
  let artist_slug = props.route.params.artist_slug

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await CifraboxService.getChordProSong(artist_slug, slug)
        let chord_pro = data.chord_pro
        let header =
          `{title: ${data.song.title}}\n` +
          `{artist: ${data.song.artist.name}}\n` +
          `{x_cifrabox_username: ${t('sent_by')}: ${data.user.username}}\n`
        setChordCheet(header + chord_pro)
        setIsLoading(false)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
          setIsLoading(false)
        } else {
          throw e
        }
      }
    }
    fetchData()
  }, []);

  function saveSong() {
    if (isSaving) return
    setIsSaving(true)
    const parser = new ChordSheetJS.ChordProParser();
    const parsedSong = parser.parse(chordSheet!);
    let artistName = parsedSong.getMetaData('artist')!
    let songTitle = parsedSong.getMetaData('title')!

    let headerlessContent = chordSheet!
    headerlessContent = headerlessContent.replace(/{artist:[^}]*}\n/g, '')
    headerlessContent = headerlessContent.replace(/{title:[^}]*}\n/g, '')

    let artist: Artist | undefined = Artist.getByName(artistName)
    if (artist == null) {
      artist = Artist.create(artistName)
    }
    let song = Song.create(artist, songTitle, headerlessContent)

    props.navigation.replace('SongView', { id: song.id, title: song.title })
    Alert.alert(t('info'), t('song_downloaded'))
  }

  return (
    <View style={{ flex: 1 }}>
      <LoadingIndicator error={error} loading={isLoading} />
      {chordSheet != null &&
        <SongTransformer
          transposeDelta={0}
          chordProSong={chordSheet}
        >
          {({ chords, htmlSong }) => (
            <View style={{ flex: 1 }}>
              <SongRender
                chordProContent={htmlSong}
              />
              <TouchableOpacity
                style={styles.fabButton}
                onPress={saveSong}>
                <Icon
                  color="white"
                  size={30}
                  name="download"
                />
              </TouchableOpacity>
            </View>
          )}
        </SongTransformer>
      }
    </View>
  );
}
export default SongPreview

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 100,
    backgroundColor: 'tomato',
    padding: 15
  },
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  itemTitle: {
    fontSize: 18
  }
});