import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import { Artist } from '../db'
import ListItem from "../components/ListItem";
import { removeArtist } from "../utils/removeArtist";
import TextInputModal from "../components/TextInputModal";
import EmptyListMessage from "../components/EmptyListMessage";
import { ROUTES } from "../AppNavigation";
import LanguageContext from "../languages/LanguageContext";

interface Props {
  navigation: NavigationScreenProp<any, any>
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
    removeArtist(id, () => {
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
        throw new Error('Empty name not allowed')
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
    <View style={styles.container}>
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
            onPress={() => { props.navigation.navigate(ROUTES.OnlineSearch) }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default ArtistList