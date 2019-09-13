import React, { useState } from "react";
import { Text, FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation"

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const PlaylistView = (props: Props) => {
  const [name] = useState('Rock')
  const [musics] = useState([{ title: 'Yesterday', id: '1' }, { title: 'Let It Be', id: '2' }]);
  return (
    <FlatList
      ListHeaderComponent={() => {
        return <Text>{name}</Text>
      }}
      data={musics}
      renderItem={({item}) =>{
        return <Text onPress={() => props.navigation.navigate('SongView')} key={item.id}>{item.title}</Text>
      }}
    />
  );
}
export default PlaylistView