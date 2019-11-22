import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Alert } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { Playlist } from "../db/Playlist";
import DraggableFlatList, { RenderItemInfo } from 'react-native-draggable-flatlist'
import TouchableIcon from "../components/TouchableIcon";
import { Song } from "../db";
import { NavigationStackOptions } from "react-navigation-stack/lib/typescript/types";
import { Header } from "react-navigation-stack";
import ErrorText from "../components/ErrorText";

interface Props {
  navigation: NavigationScreenProp<any, { id: string, title: string }>
  isFocused: boolean
}
const PlaylistView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let playlist = Playlist.getById(id)!
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState(Array.from(playlist.songs))
  const [error, setError] = useState<string | null>(null)

  function onPressCancel() {
    props.navigation.goBack()
  }
  function onPressSavePlaylist() {
    try {
      Playlist.update(playlist.id, name, songs)
      props.navigation.goBack()
      Alert.alert('Info', 'Playlist saved')
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        throw e
      }
    }
  }
  function onPressRemoveSong(song: Song) {
    setSongs(songs.filter(s => s != song))
  }
  function renderItem(info: RenderItemInfo<Song>) {
    let { item, move, moveEnd } = info
    return (
      <View style={styles.item}>
        <TouchableIcon style={{ flex: 0 }} size={20} onPress={() => onPressRemoveSong(item)} name="minus-circle-outline" />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>{item.title}</Text>
          <TouchableIcon activeOpacity={1} onPressIn={move} onPressOut={moveEnd} name="drag" />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableIcon name="close" onPress={onPressCancel} />
        <Text style={styles.headerTitle}>Playlist Edit</Text>
        <TouchableIcon name="check" onPress={onPressSavePlaylist} />
      </View>
      <View>
        <TextInput value={name} onChangeText={value => setName(value)} />
        <ErrorText>{error}</ErrorText>
      </View>
      <DraggableFlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => `draggable-item-${item.id}`}
        scrollPercent={5}
        onMoveEnd={({ data }) => { if (data != null) setSongs(Array.from(data)) }}
      />
    </View>
  )
}
PlaylistView.navigationOptions = (props: Props): NavigationStackOptions => ({
  title: props.navigation.getParam('title'),
  headerTransparent: true,
  headerLeft: null
});

export default PlaylistView

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Header.HEIGHT
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  textContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18
  },
  subtitle: {
    fontSize: 14
  }
});