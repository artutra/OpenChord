import React, { useState } from "react";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const ArtistList = () => {
  const [artists, setArtists] = useState([{ name: 'The Beatles', id: '1' }, { name: 'Coldplay', id: '2' }]);
  return (
    <FlatList
      data={artists}
      renderItem={({item}) =>{
        return <Text key={item.id}>{item.name}</Text>
      }}
    />
  );
}
export default ArtistList