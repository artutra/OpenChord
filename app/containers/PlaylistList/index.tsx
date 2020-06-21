import React, { useState, FunctionComponent, useContext, useCallback } from "react";
import { FlatList } from "react-native";
import ListItem from "../../components/ListItem";
import { Playlist } from "../../db/Playlist";
import { MainTabParamList, RootStackParamList } from "../../AppNavigation";
import TouchableIcon from "../../components/TouchableIcon";
import EmptyListMessage from "../../components/EmptyListMessage";
import TextInputModal from "../../components/TextInputModal";
import { createBundle } from "../../db/bundler";
import createFile from "../../utils/createFile";
import Share from "react-native-share";
import LanguageContext from "../../languages/LanguageContext";
import { CompositeNavigationProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { alertDelete } from "../../utils/alertDelete";

type PlaylistListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'PlaylistList'>,
  StackNavigationProp<RootStackParamList, 'MainTab'>
>
type Props = {
  navigation: PlaylistListScreenNavigationProp
}
const PlaylistList: FunctionComponent<Props> = (props: Props) => {
  const [playlists, setPlaylists] = useState(Playlist.getAll())
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useContext(LanguageContext)

  function onSelectPlaylist(id: string, name: string) {
    props.navigation.navigate('PlaylistView', { id, title: name })
  }
  function onPressDeletePlaylist(id: string) {
    alertDelete('playlist', id, () => {
      setPlaylists(Playlist.getAll())
    })
  }
  async function onPressShare(id: string, name: string) {
    try {
      let bundle = createBundle([id], [])
      let bundleString = JSON.stringify(bundle)
      let path = await createFile('documents', 'playlist_' + name.toLowerCase(), bundleString)
      await Share.open({
        url: "file://" + path,
        message: t('share_message')
      })
    } catch (e) {
      console.warn(e.message)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setPlaylists(Playlist.getAll())
    }, [])
  );

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={t('playlists')}
        headerRight={<TouchableIcon onPress={() => setShowAddPlaylistModal(true)} name="plus" />}
      />
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
    </SafeAreaView>
  )
}

export default PlaylistList