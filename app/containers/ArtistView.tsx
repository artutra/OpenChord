import React, { useState } from "react";
import { Text, FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { Song, Artist } from "../db";
import ListItem from "../components/ListItem";

interface Props {
  navigation: NavigationScreenProp<any, { id: string, title: string }>
}
const ArtistView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let artist = Artist.getById(id)!
  const [name] = useState(artist.name)
  const [musics] = useState(Song.getByArtist(artist.id!))

  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  return (
    <FlatList
      data={musics}
      renderItem={({ item }) => {
        return <ListItem key={item.id!} title={item.title} onPress={() => onSelectSong(item.id!, item.title)} />
      }}
    />
  );
}
ArtistView.navigationOptions = (props: Props) => ({
  title: props.navigation.getParam('title')
});

export default ArtistView