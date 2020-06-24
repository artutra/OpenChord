import React, { useState, useEffect, useRef, useContext } from "react";
import { FlatList, View, TextInput, StyleSheet } from "react-native";
import { Song } from "../db";
import ListItem from "../components/ListItem";
import { Playlist } from "../db/Playlist";
import { RootStackParamList, MainTabParamList } from "../AppNavigation";
import SearchBar from "../components/SearchBar";
import LanguageContext from "../languages/LanguageContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";
import EmptyListMessage from "../components/EmptyListMessage";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type PlaylistAddSongsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'PlaylistAddSongs'>,
  BottomTabNavigationProp<MainTabParamList, 'PlaylistList'>
>;
type PlaylistAddSongsScreenRouteProp = RouteProp<RootStackParamList, 'PlaylistAddSongs'>

type Props = {
  route: PlaylistAddSongsScreenRouteProp
  navigation: PlaylistAddSongsScreenNavigationProp
}
const PlaylistAddSongs = (props: Props) => {
  const { route } = props
  const id = route.params.id
  const [playlist] = useState(Playlist.getById(id)!)
  const [songs, setSongs] = useState(Song.getAll())
  const [query, setQuery] = useState('')
  const { t } = useContext(LanguageContext)
  const searchInput = useRef<TextInput>(null)

  function onSelectSong(id: string, title: string) {
    let song = Song.getById(id)!
    if (Playlist.hasSong(playlist, song)) {
      Playlist.removeSong(playlist, song)
    } else {
      Playlist.addSong(playlist, song)
    }
    setSongs(Song.search(query))
  }

  function onSubmitEditing() { }
  useEffect(() => {
    setSongs(Song.search(query))
  }, [query])

  return (
    <>
      <SearchBar
        inputRef={searchInput}
        onSubmitEditing={onSubmitEditing}
        onChangeText={(value) => setQuery(value)}
        query={query}
        placeholder={t('search')}
      />
      <FlatList
        contentContainerStyle={styles.container}
        data={songs}
        ListEmptyComponent={
          <EmptyListMessage
            message={t('you_havent_downloaded_any_song_yet')}
            onPress={() => { props.navigation.navigate('OnlineSearch') }}
            buttonTitle={t('go_to_online_search').toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          return <ListItem
            key={item.id!}
            title={item.title}
            subtitle={item.artist.name}
            onPress={() => onSelectSong(item.id!, item.title)}
            showIcon={Playlist.hasSong(playlist, item) ? 'check' : 'plus'}
          />
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default PlaylistAddSongs