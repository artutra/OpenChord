import React, { useState } from "react";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([{ name: 'Missa', id: '1' }, { name: 'Rock', id: '2' }]);
  return (
    <FlatList
      data={playlists}
      renderItem={({item}) =>{
        return <Text key={item.id}>{item.name}</Text>
      }}
    />
  );
}
export default PlaylistList