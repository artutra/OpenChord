import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { Text, View, Button, FlatList } from "react-native";
import { NavigationScreenProp, NavigationScreenComponent } from "react-navigation"
import ListItem from "../../components/ListItem";
import { Playlist } from "../../db/Playlist";
import { ROUTES } from "../../AppNavigation";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import TouchableIcon from "../../components/TouchableIcon";
import { removePlaylist } from "../../utils/removePlaylist";
import EmptyListMessage from "../../components/EmptyListMessage";
import TextInputModal from "../../components/TextInputModal";
import { createBundle } from "../../db/bundler";
import createFile from "../../utils/createFile";
import Share from "react-native-share";
import LanguageContext from "../../languages/LanguageContext";

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
  const { t } = useContext(LanguageContext)

  function onSelectPlaylist(id: string, name: string) {
    props.navigation.navigate(ROUTES.PlaylistView, { id, title: name })
  }
  function onPressDeletePlaylist(id: string) {
    removePlaylist(id, () => {
      setPlaylists(Playlist.getAll())
    })
  }
  async function onPressShare(id: string, name: string) {
    try {
      let bundle = createBundle([id], [])
      let bundleString = JSON.stringify(bundle)
      let path = await createFile('playlist_' + name.toLowerCase(), bundleString)
      await Share.open({
        url: "file://" + path,
        message: t('share_message')
      })
    } catch (e) {
      console.warn(e.message)
    }
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

  function onSubmit(playlistName: string) {
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
      <TextInputModal
        error={error}
        enabled={showAddPlaylistModal}
        onDismiss={() => {
          setError(null)
          setShowAddPlaylistModal(false)
        }}
        onSubmit={onSubmit}
        submitButtonTitle={t('create').toUpperCase()}
        placeholder={t('playlist_name')}
      />
      <FlatList
        contentContainerStyle={playlists.length <= 0 ? { flex: 1 } : {}}
        data={playlists}
        ListEmptyComponent={
          <EmptyListMessage
            message={t('you_havent_created_any_playlist_yet')}
            onPress={() => setShowAddPlaylistModal(true)}
            buttonTitle={t('create_new_playlist').toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              title={item.name}
              onPress={() => onSelectPlaylist(item.id!, item.name)}
              options={[
                { title: t('share'), onPress: () => onPressShare(item.id, item.name) },
                { title: t('delete'), onPress: () => onPressDeletePlaylist(item.id!) }
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