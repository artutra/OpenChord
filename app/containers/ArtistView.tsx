import React, { useState, useContext } from "react";
import { Text, FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { Song, Artist } from "../db";
import ListItem from "../components/ListItem";
import { removeSong } from "../utils/removeSong";
import LanguageContext from "../languages/LanguageContext";

export type ArtistViewParams = { id: string, title: string }
interface Props {
  navigation: NavigationScreenProp<any, ArtistViewParams>
}
const ArtistView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let artist = Artist.getById(id)!
  const [name] = useState(artist.name)
  const [musics, setMusics] = useState(Song.getByArtist(artist.id!))
  const { t } = useContext(LanguageContext)

  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  function onPressEditSong(id: string) {
    props.navigation.navigate('SongEdit', { id })
  }
  function onPressDeleteSong(id: string) {
    removeSong(id, () => {
      let songs = Song.getByArtist(artist.id!)
      if (songs.length > 0) {
        setMusics(songs)
      } else {
        props.navigation.goBack()
      }
    })
  }
  return (
    <FlatList
      data={musics}
      renderItem={({ item }) => {
        return <ListItem
          key={item.id!}
          title={item.title}
          onPress={() => onSelectSong(item.id!, item.title)}
          options={[
            { title: t('edit'), onPress: () => onPressEditSong(item.id!) },
            { title: t('delete'), onPress: () => onPressDeleteSong(item.id!) }
          ]}
        />
      }}
    />
  );
}
ArtistView.navigationOptions = (props: Props) => ({
  title: props.navigation.getParam('title')
});

export default ArtistView