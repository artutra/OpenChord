import React, { useState, useEffect } from "react";
import { Text, FlatList, View, Button, TextInput } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import ListItem from "../components/ListItem";
import { Playlist } from "../db/Playlist";
import { ROUTES } from "../AppNavigation";

interface Props {
  navigation: NavigationScreenProp<any, { id: string, title: string }>
  isFocused: boolean
}
const PlaylistView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let playlist = Playlist.getById(id)!
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState(playlist.songs)

  return (
    <FlatList
      data={songs}
      ListHeaderComponent={() => {
        return (
          <TextInput value={name} onChangeText={(value) => setName(value)} />
        )
      }}
      renderItem={({ item }) => {
        return <ListItem
          key={item.id!}
          title={item.title}
          onPress={() => { }}
        />
      }}
    />
  );
}
PlaylistView.navigationOptions = (props: Props) => ({
  title: props.navigation.getParam('title')
});

export default PlaylistView