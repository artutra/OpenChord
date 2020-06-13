import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { FlatList, View, TouchableOpacity, Text } from "react-native";
import { NavigationScreenProp, withNavigationFocus, NavigationScreenComponent } from "react-navigation"
import ListItem, { LeftIconOptions } from "../components/ListItem";
import { removeSong } from "../utils/removeSong";
import { Playlist, SortBy } from "../db/Playlist";
import { ROUTES } from "../AppNavigation";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import TouchableIcon from "../components/TouchableIcon";
import EmptyListMessage from "../components/EmptyListMessage";
import PrimaryButton from "../components/PrimaryButton";
import LanguageContext from "../languages/LanguageContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PickerModal, { PickerOption } from "../components/PickerModal";
import { Song } from "../db";
import { List, Results } from "realm";

interface Params {
  id: string
  title?: string
  onPressEditPlaylist: () => void
}
interface Props {
  navigation: NavigationScreenProp<any, Params>
  isFocused: boolean
}
const PlaylistView: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props: Props) => {
  let id = props.navigation.getParam('id')
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
    removeSong(songId, () => {
      let playlist = Playlist.getById(id)!
      setSongs(playlist.songs)
    })
  }
  function onPressAddSongs() {
    props.navigation.navigate(ROUTES.PlaylistAddSongs, { id })
  }
  function onPressEditPlaylist() {
    props.navigation.navigate(ROUTES.PlaylistEdit, { id })
  }

  useEffect(() => {
    setSongs(playlist.songs)
    setName(playlist.name)
  }, [props.isFocused])

  useEffect(() => {
    props.navigation.setParams({ 'onPressEditPlaylist': onPressEditPlaylist })
    props.navigation.setParams({ 'title': name })
  }, [songs, name])

  function onChangeSortBy(value: SortBy) {
    if (value === sortBy) {
      setReverse(!reverse)
    } else {
      setSortBy(value)
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

  return (
    <>
      <FlatList
        contentContainerStyle={songs.length <= 0 ? { flex: 1 } : {}}
        data={songs}
        ListHeaderComponent={() => {
          if (songs.length > 0)
            return (
              <View>
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
            message={t('you_havent_downloaded_any_song_yet')}
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
PlaylistView.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <TouchableIcon onPress={navigation.getParam('onPressEditPlaylist')} name="pencil" />,
    title: navigation.getParam('title')
  }
}

export default withNavigationFocus(PlaylistView)