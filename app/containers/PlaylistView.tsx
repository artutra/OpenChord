import React, { useState, useEffect, FunctionComponent, useContext, useLayoutEffect, useCallback } from "react";
import { FlatList, View, TouchableOpacity, Text } from "react-native";
import ListItem, { LeftIconOptions } from "../components/ListItem";
import { Playlist, SortBy } from "../db/Playlist";
import { RootStackParamList } from "../AppNavigation";
import TouchableIcon from "../components/TouchableIcon";
import EmptyListMessage from "../components/EmptyListMessage";
import PrimaryButton from "../components/PrimaryButton";
import LanguageContext from "../languages/LanguageContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PickerModal, { PickerOption } from "../components/PickerModal";
import { Song } from "../db";
import { List, Results } from "realm";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { alertDelete } from "../utils/alertDelete";

type PlaylistViewScreenRouteProp = RouteProp<RootStackParamList, 'PlaylistView'>;
type PlaylistViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlaylistView'
>;

type Props = {
  route: PlaylistViewScreenRouteProp
  navigation: PlaylistViewScreenNavigationProp;
}
const PlaylistView: FunctionComponent<Props> = (props: Props) => {
  const { route, navigation } = props
  let id = route.params.id
  let playlist = Playlist.getById(id)!
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState<Results<Song> | List<Song> | Song[]>(playlist.songs)
  const [enableSortSelect, setEnableSortSelect] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('CUSTOM')
  const [reverse, setReverse] = useState(false)
  const [sortOptions, setSortOptions] = useState<PickerOption<SortBy>[]>([])

  const { t } = useContext(LanguageContext)

  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  function onPressEditSong(id: string) {
    props.navigation.navigate('SongEdit', { id })
  }
  function onPressDeleteSong(songId: string) {
    alertDelete('song', songId, () => {
      let playlist = Playlist.getById(id)!
      setSongs(playlist.songs)
    })
  }
  function onPressAddSongs() {
    props.navigation.navigate('PlaylistAddSongs', { id })
  }
  function onPressEditPlaylist() {
    props.navigation.navigate('PlaylistEdit', { id })
  }

  useFocusEffect(
    useCallback(() => {
      setSongs(playlist.songs)
      setName(playlist.name)
    }, [])
  );

  function onChangeSortBy(value: SortBy) {
    if (value === sortBy && value !== 'CUSTOM') {
      setReverse(!reverse)
    } else {
      setSortBy(value)
      if (value === 'CUSTOM') {
        setReverse(false)
      }
    }
  }

  useEffect(() => {
    let sortOptionsValues: { label: string, value: SortBy }[] = [
      { label: t('custom_sort'), value: 'CUSTOM' },
      { label: t('sort_by_title'), value: 'TITLE' },
      { label: t('sort_by_artist'), value: 'ARTIST' }
    ]
    let newOptions: PickerOption<SortBy>[] = sortOptionsValues.map(({ label, value }) => {
      let leftIcon: LeftIconOptions = 'empty-space'
      if (value === sortBy) {
        if (value === 'CUSTOM') {
          leftIcon = 'arrow-down'
        } else {
          leftIcon = reverse ? 'arrow-up' : 'arrow-down'
        }
      }
      return { label, leftIcon, value, key: 'sort-' + value }
    })
    setSortOptions(newOptions)
    let sortedSongs = Playlist.getSongs(playlist, sortBy, reverse)
    setSongs(sortedSongs)
  }, [reverse, sortBy, t])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <TouchableIcon onPress={onPressEditPlaylist} name="pencil" />
    });
  }, [navigation]);
  return (
    <>
      <FlatList
        contentContainerStyle={songs.length <= 0 ? { flex: 1 } : {}}
        data={songs}
        ListHeaderComponent={() => {
          if (songs.length > 0)
            return (
              <View style={{ backgroundColor: 'white' }}>
                <PrimaryButton style={{ margin: 10 }} onPress={onPressAddSongs} title={t('add_songs').toUpperCase()} outline />
                <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 18, borderBottomWidth: 1, borderColor: '#eee', paddingLeft: 20, alignItems: 'center' }} onPress={() => setEnableSortSelect(true)}>
                  <Text style={{ color: '#777' }}>{sortOptions.find(o => o.value === sortBy)?.label.toUpperCase()}</Text>
                  <MaterialCommunityIcons
                    name={reverse ? 'arrow-up' : 'arrow-down'}
                    style={{ marginLeft: 8 }}
                    size={20}
                    color='#777' />
                </TouchableOpacity>
              </View>
            )
          else
            return null
        }}
        ListEmptyComponent={
          <EmptyListMessage
            message={t('you_havent_added_any_song_to_this_playlist_yet')}
            onPress={onPressAddSongs}
            buttonTitle={t('add_songs').toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          return <ListItem
            key={item.id!}
            title={item.title}
            subtitle={item.artist.name}
            onPress={() => onSelectSong(item.id!, item.title)}
            options={[
              { title: t('edit'), onPress: () => onPressEditSong(item.id!) },
              { title: t('delete'), onPress: () => onPressDeleteSong(item.id!) }
            ]}
          />
        }}
      />
      <PickerModal
        show={enableSortSelect}
        value={sortBy}
        options={sortOptions}
        onDismiss={() => setEnableSortSelect(false)}
        onChange={onChangeSortBy}
      />
    </>
  );
}

export default PlaylistView