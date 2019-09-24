import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import { Artist, Song } from '../db'
import ListItem from "../components/ListItem";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const ArtistList = (props: Props) => {
  const [artists, setArtists] = useState(Artist.getAll());
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (Song.shouldUpdateDb()) {
      Song.populateDb()
      setArtists(Artist.getAll())
    }
    setIsLoading(false)
  }, [isLoading])

  function onSelectArtist(id: string, name: string) {
    props.navigation.navigate('ArtistView', { id, title: name })
  }

  useEffect(() => {
    const didBlurSubscription = props.navigation.addListener(
      'didFocus',
      payload => {
        setArtists(Artist.getAll())
      }
    )
    return () => didBlurSubscription.remove()
  }, [artists])

  return (
    <View>
      {isLoading && <Text>Is loading...</Text>}
      <FlatList
        data={artists}
        renderItem={({ item }) => {
          return <ListItem key={item.id!} title={item.name} onPress={() => onSelectArtist(item.id!, item.name)} />
        }}
      />
    </View>
  );
}

ArtistList.navigationOptions = (props: Props) => ({
  title: 'Artists'
});

export default ArtistList