import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { Text, View, TextInput, StyleSheet, Alert } from "react-native";
import { NavigationScreenProp, NavigationScreenComponent } from "react-navigation"
import { Playlist } from "../../db/Playlist";
import DraggableFlatList, { RenderItemInfo } from 'react-native-draggable-flatlist'
import TouchableIcon from "../../components/TouchableIcon";
import { Song } from "../../db";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import { Header } from "react-navigation-stack";
import ErrorText from "../../components/ErrorText";
import DraggableItem from "./compoents/DraggableItem";
import LanguageContext from "../../languages/LanguageContext";

interface Props {
  navigation: NavigationScreenProp<any, { id: string, title: string }>
  isFocused: boolean
}
const PlaylistEdit: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props: Props) => {
  let id = props.navigation.getParam('id')
  let playlist = Playlist.getById(id)!
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState(Array.from(playlist.songs))
  const [error, setError] = useState<string | null>(null)
  const { t } = useContext(LanguageContext)

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
      <DraggableItem
        title={item.title}
        subtitle={item.artist.name}
        onPressDelete={() => onPressRemoveSong(item)}
        onDragStart={move}
        onDragEnd={moveEnd}
      />
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableIcon name="close" onPress={onPressCancel} />
        <Text style={styles.headerTitle}>{t('playlist_edit')}</Text>
        <TouchableIcon name="check" onPress={onPressSavePlaylist} />
      </View>
      <View style={styles.playlistNameInputContiner}>
        <TextInput
          style={styles.playlistNameInput}
          value={name}
          onChangeText={value => setName(value)}
          placeholder={t('playlist_name')}
        />
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
PlaylistEdit.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title'),
  headerTransparent: true,
  headerLeft: null
});

export default PlaylistEdit

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playlistNameInputContiner: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playlistNameInput: {
    fontSize: 22,
    textAlign: 'center',
    borderBottomWidth: 2,
    maxWidth: 250
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