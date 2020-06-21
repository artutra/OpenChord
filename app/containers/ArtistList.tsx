import React, { useState, useContext, useCallback } from "react";
import { View, StyleSheet, FlatList, StatusBar } from "react-native";
import { Artist } from '../db'
import ListItem from "../components/ListItem";
import TextInputModal from "../components/TextInputModal";
import EmptyListMessage from "../components/EmptyListMessage";
import { RootStackParamList, MainTabParamList } from "../AppNavigation";
import LanguageContext from "../languages/LanguageContext";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import CustomHeader from "../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { alertDelete } from "../utils/alertDelete";

type ArtistListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ArtistList'>,
  StackNavigationProp<RootStackParamList, 'MainTab'>
>;

type Props = {
  navigation: ArtistListScreenNavigationProp;
}

const ArtistList = (props: Props) => {
  const [artists, setArtists] = useState(Artist.getAll())
  const [error, setError] = useState<string | null>(null)
  const [showEditArtistModal, setShowEditArtistModal] = useState(false)
  const [artistEditName, setArtistEditName] = useState<string>('')
  const [artistEditId, setArtistEditId] = useState<string | null>(null)
  const { t } = useContext(LanguageContext)

  function onSelectArtist(id: string, name: string) {
    props.navigation.navigate('ArtistView', { id, title: name })
  }
  function onPressDeleteArtist(id: string) {
    alertDelete('artist', id, () => {
      setArtists(Artist.getAll())
    })
  }
  function onPressEditArtist(id: string, name: string) {
    setError(null)
    setArtistEditId(id)
    setArtistEditName(name)
    setShowEditArtistModal(true)
  }
  function onSubmitArtistName() {
    try {
      if (artistEditName == '') {
        throw new Error(t('empty_name_not_allowed'))
      } else if (artistEditId) {
        Artist.update(artistEditId, artistEditName)
        setShowEditArtistModal(false)
        setArtists(Artist.getAll())
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        throw e
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      setArtists(Artist.getAll())
    }, [])
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <CustomHeader title={t('artists')} />
      <TextInputModal
        error={error}
        value={artistEditName}
        onChange={(value) => setArtistEditName(value)}
        enabled={showEditArtistModal}
        onDismiss={() => {
          setError(null)
          setShowEditArtistModal(false)
        }}
        onSubmit={onSubmitArtistName}
      />
      <FlatList
        data={artists}
        contentContainerStyle={artists.length <= 0 ? { flex: 1 } : {}}
        ListEmptyComponent={
          <EmptyListMessage
            message={t('you_havent_downloaded_any_song_yet')}
            onPress={() => { props.navigation.navigate('OnlineSearch') }}
            buttonTitle={t('go_to_online_search').toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              title={item.name}
              onPress={() => onSelectArtist(item.id!, item.name)}
              options={[
                { title: t('edit'), onPress: () => onPressEditArtist(item.id, item.name) },
                { title: t('delete'), onPress: () => onPressDeleteArtist(item.id!) }
              ]} />
          )
        }}
      />
    </SafeAreaView>
  );
}

export default ArtistList