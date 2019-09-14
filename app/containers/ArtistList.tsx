import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import realm, { Artist } from '../db'
import ListItem from "../components/ListItem";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const ArtistList = (props: Props) => {
  const [artists, setArtists] = useState(realm.objects<Artist>('Artist'));
  function onSelectArtist(id: string, name: string) {
    props.navigation.navigate('ArtistView', { id, title: name })
  }
  return (
    <FlatList
      data={artists}
      renderItem={({ item }) => {
        return <ListItem key={item.id!} title={item.name} onPress={() => onSelectArtist(item.id!, item.name)} />
      }}
    />
  );
}

ArtistList.navigationOptions = (props: Props) => ({
  title: 'Artists'
});

export default ArtistList