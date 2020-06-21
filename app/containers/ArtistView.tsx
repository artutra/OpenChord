import React, { useState, useContext, FC } from "react";
import { FlatList } from "react-native";
import { Song, Artist } from "../db";
import ListItem from "../components/ListItem";
import LanguageContext from "../languages/LanguageContext";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { alertDelete } from "../utils/alertDelete";

type ArtistViewScreenRouteProp = RouteProp<RootStackParamList, 'ArtistView'>;
type ArtistViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ArtistView'
>;
type Props = {
  route: ArtistViewScreenRouteProp
  navigation: ArtistViewScreenNavigationProp;
}
const ArtistView: FC<Props> = (props) => {
  let id = props.route.params.id
  let artist = Artist.getById(id)!
  const [musics, setMusics] = useState(Song.getByArtist(artist.id!))
  const { t } = useContext(LanguageContext)

  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  function onPressEditSong(id: string) {
    props.navigation.navigate('SongEdit', { id })
  }
  function onPressDeleteSong(id: string) {
    alertDelete('song', id, () => {
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

export default ArtistView