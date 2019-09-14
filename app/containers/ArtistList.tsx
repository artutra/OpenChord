import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import realm, { Artist } from '../db'

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const ArtistList = (props: Props) => {
  const [artists, setArtists] = useState(realm.objects<Artist>('Artist'));
  return (
    <FlatList
      data={artists}
      renderItem={({ item}) =>{
        return <Text onPress={() => props.navigation.navigate('ArtistView', { id: item.id })} key={item.id!}>{item.name}</Text>
      }}
    />
  );
}
export default ArtistList