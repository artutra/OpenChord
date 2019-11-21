import React, { useState, useEffect } from "react";
import { Text, View, Button, FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import ListItem from "../../components/ListItem";
import { Playlist } from "../../db/Playlist";
import { ROUTES } from "../../AppNavigation";
import CreatePlaylistModal from "./components/CreatePlaylistModal";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const PlaylistList = (props: Props) => {
  const [playlists, setPlaylists] = useState(Playlist.getAll())
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false)

  function onSelectPlaylist(id: string, name: string) {
    // props.navigation.navigate(ROUTES.PlaylistView, { id, title: name })
  }
  function onPressDeletePlaylist(id: string) {
    // TODO: Add removePlaylist helper
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
  function onPressCreate(playlistName: string) {
    Playlist.create(playlistName)
    setShowAddPlaylistModal(false)
    setPlaylists(Playlist.getAll())

  }
  return (
    <View style={{ flex: 1 }}>
      <CreatePlaylistModal
        enabled={showAddPlaylistModal}
        onDismiss={() => setShowAddPlaylistModal(false)}
        onPressCreate={onPressCreate}
      />
      <FlatList
        contentContainerStyle={{ flex: 1 }}
        data={playlists}
        ListEmptyComponent={() => {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>You haven't created any playlist yet</Text>
              <Button onPress={() => setShowAddPlaylistModal(true)} title="CREATE NEW PLAYLIST" />
            </View>
          )
        }}
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

export default PlaylistList