import React, { useState } from "react";
import { Text, FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import realm, { Song, Artist } from "../db";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const ArtistView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let artist = realm.objectForPrimaryKey<Artist>('Artist', id)!
  const [name] = useState(artist.name)
  const [musics] = useState(realm.objects<Song>('Song').filtered('artist.id = $0', id));
  return (
    <FlatList
      ListHeaderComponent={() => {
        return <Text>{name}</Text>
      }}
      data={musics}
      renderItem={({item}) =>{
        return <Text onPress={() => props.navigation.navigate('SongView', { id: item.id })} key={item.id!}>{item.title}</Text>
      }}
    />
  );
}
export default ArtistView