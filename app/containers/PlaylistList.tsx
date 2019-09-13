import React, { useState } from "react";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation"

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const PlaylistList = (props: Props) => {
  const [playlists, setPlaylists] = useState([{ name: 'Missa', id: '1' }, { name: 'Rock', id: '2' }]);
  return (
    <FlatList
      data={playlists}
      renderItem={({item}) =>{
        return <Text onPress={() => props.navigation.navigate('PlaylistList')} key={item.id}>{item.name}</Text>
      }}
    />
  );
}
export default PlaylistList