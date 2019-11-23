import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, Button, FlatList } from "react-native";
import { NavigationScreenProp, NavigationScreenComponent } from "react-navigation"
import ListItem from "../../components/ListItem";
import { Playlist } from "../../db/Playlist";
import { ROUTES } from "../../AppNavigation";
import CreatePlaylistModal from "./components/CreatePlaylistModal";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import TouchableIcon from "../../components/TouchableIcon";
import { removePlaylist } from "../../utils/removePlaylist";
import EmptyListMessage from "../../components/EmptyListMessage";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const PlaylistList: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props: Props) => {
  const [playlists, setPlaylists] = useState(Playlist.getAll())
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onSelectPlaylist(id: string, name: string) {
    props.navigation.navigate(ROUTES.PlaylistView, { id, title: name })
  }
  function onPressDeletePlaylist(id: string) {
    removePlaylist(id, () => {
      setPlaylists(Playlist.getAll())
    })
  }

  useEffect(() => {
    const didBlurSubscription = props.navigation.addListener(
      'didFocus',
      payload => {
        setPlaylists(Playlist.getAll())
      }
    )
    return () => didBlurSubscription.remove()
  }, [playlists])

  function onCreate(playlistName: string) {
    try {
      Playlist.create(playlistName)
      setShowAddPlaylistModal(false)
      setPlaylists(Playlist.getAll())
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        throw e
      }
    }
  }

  useEffect(() => {
    props.navigation.setParams({ 'onPressCreatePlaylist': () => setShowAddPlaylistModal(true) })
  }, [playlists])
  return (
    <View style={{ flex: 1 }}>
      <CreatePlaylistModal
        error={error}
        enabled={showAddPlaylistModal}
        onDismiss={() => setShowAddPlaylistModal(false)}
        onPressCreate={onCreate}
      />
      <FlatList
        contentContainerStyle={{ flex: 1 }}
        data={playlists}
        ListEmptyComponent={
          <EmptyListMessage
            message="You haven't created any playlist yet"
            onPress={() => setShowAddPlaylistModal(true)}
            buttonTitle="CREATE NEW PLAYLIST"
          />
        }
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              title={item.name}
              onPress={() => onSelectPlaylist(item.id!, item.name)}
              options={[
                { title: 'Delete', onPress: () => onPressDeletePlaylist(item.id!) }
              ]} />
          )
        }}
      />
    </View>

  );
}
PlaylistList.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <TouchableIcon onPress={navigation.getParam('onPressCreatePlaylist')} name="plus" />,
    title: navigation.getParam('title')
  }
}

export default PlaylistList