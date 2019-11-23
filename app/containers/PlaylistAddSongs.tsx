import React, { useState, useEffect, useRef } from "react";
import { Text, FlatList, View, Button, TextInput, StyleSheet } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { Song, Artist } from "../db";
import ListItem from "../components/ListItem";
import { Playlist } from "../db/Playlist";
import { ROUTES } from "../AppNavigation";
import SearchBar from "../components/SearchBar";

interface Props {
  navigation: NavigationScreenProp<any, { id: string, title: string }>
}
const PlaylistAddSongs = (props: Props) => {
  const id = props.navigation.getParam('id')
  const [playlist] = useState(Playlist.getById(id)!)
  const [songs, setSongs] = useState(Song.getAll())
  const [query, setQuery] = useState('')
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
    <View style={styles.container}>
      <SearchBar
        inputRef={searchInput}
        onSubmitEditing={onSubmitEditing}
        onChangeText={(value) => setQuery(value)}
        query={query}
      />
      <FlatList
        data={songs}
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
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default PlaylistAddSongs