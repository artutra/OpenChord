import React, { useState, useEffect } from "react";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import realm, { Song } from '../db'
import ListItem from "../components/ListItem";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const SongList = (props: Props) => {
  const [songs] = useState(realm.objects<Song>('Song').sorted('title'));
  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  return (
    <FlatList
      data={songs}
      renderItem={({ item }) => {
        return <ListItem key={item.id!} title={item.title} onPress={() => onSelectSong(item.id!, item.title)} />
      }}
    />
  );
}

SongList.navigationOptions = (props: Props) => ({
  title: 'Songs'
});

export default SongList