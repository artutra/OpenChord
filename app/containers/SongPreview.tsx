import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import SongRender from "../components/SongRender";
import SongTransformer from "../components/SongTransformer";
import { getService } from "../services";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChordSheetJS from 'chordsheetjs';
import { Artist, Song } from "../db";
import { RootStackParamList } from "../AppNavigation";
import LoadingIndicator from "../components/LoadingIndicator";
import LanguageContext from "../languages/LanguageContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

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
  let serviceName = props.route.params.serviceName
  let path = props.route.params.path

  useEffect(() => {
    const fetchData = async () => {
      try {
        let service = getService(serviceName)!
        let chordPro = await service.getChordProSong(path)
        setChordCheet(chordPro)
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