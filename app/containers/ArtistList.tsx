import React, { useState } from "react";
import { Text } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const ArtistList = (props: Props) => {
  const [artists, setArtists] = useState([{ name: 'The Beatles', id: '1' }, { name: 'Coldplay', id: '2' }]);
  return (
    <FlatList
      data={artists}
      renderItem={({item}) =>{
        return <Text onPress={() => props.navigation.navigate('ArtistView')} key={item.id}>{item.name}</Text>
      }}
    />
  );
}
export default ArtistList