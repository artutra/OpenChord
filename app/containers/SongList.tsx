import React, { useState, useEffect, FunctionComponent } from "react";
import { NavigationScreenProp, NavigationScreenComponent, withNavigationFocus } from "react-navigation"
import { Song } from '../db'
import ListItem from "../components/ListItem";
import TouchableIcon from "../components/TouchableIcon";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import { removeSong } from "../utils/removeSong";
import { FlatList, StyleSheet, View } from "react-native";
import SearchBar from "../components/SearchBar";
import EmptyListMessage from "../components/EmptyListMessage";
import { ROUTES } from "../AppNavigation";

interface Props {
  navigation: NavigationScreenProp<any, { addSong: () => void }>
  isFocused: boolean
}
const SongList: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props: Props) => {
  const [songs, setSongs] = useState(Song.getAll())
  const [query, setQuery] = useState('')

  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  function addNewSong() {
    props.navigation.navigate('SongEdit')
  }
  function onPressEditSong(id: string) {
    props.navigation.navigate('SongEdit', { id })
  }
  function onPressGoToArtist(id: string) {
    let artist = Song.getById(id)!.artist
    props.navigation.navigate('ArtistView', { id: artist.id, title: artist.name })
  }
  function onPressDeleteSong(id: string) {
    removeSong(id, () => {
      setSongs(Song.getAll())
    })
  }

  useEffect(() => {
    if (query != '') {
      setSongs(Song.search(query))
    } else {
      setSongs(Song.getAll())
    }
  }, [query])

  useEffect(() => {
    props.navigation.setParams({ 'addSong': addNewSong })
  }, [songs])

  useEffect(() => {
    if (query != '') {
      setSongs(Song.search(query))
    } else {
      setSongs(Song.getAll())
    }
  }, [props.isFocused])

  return (
    <View style={styles.container}>
      <SearchBar
        onChangeText={(value) => setQuery(value)}
        query={query}
      />
      <FlatList
        data={songs}
        contentContainerStyle={songs.length <= 0 ? { flex: 1 } : {}}
        ListEmptyComponent={
          <EmptyListMessage
            message="Mbola tsy manana hira enao"
            onPress={() => { props.navigation.navigate(ROUTES.OnlineSearch) }}
            buttonTitle="HITADY HIRA"
          />
        }
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              title={item.title}
              subtitle={item.artist.name}
              onPress={() => onSelectSong(item.id!, item.title)}
              options={[
                { title: 'Mpihira', onPress: () => onPressGoToArtist(item.id!) },
                { title: 'Hovaina', onPress: () => onPressEditSong(item.id!) },
                { title: 'Esorina', onPress: () => onPressDeleteSong(item.id!) }
              ]}
            />
          )
        }}
      />
    </View>
  )
}
SongList.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <TouchableIcon onPress={navigation.getParam('addSong')} name="plus" />,
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default withNavigationFocus(SongList)