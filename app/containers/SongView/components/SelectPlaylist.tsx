import React, { useState, FC } from "react";
import { Text, View, TouchableOpacity, StyleSheet, FlatList, StyleProp, ViewStyle, Dimensions } from "react-native";
import { Playlist } from "../../../db/Playlist";
import ListItem from "../../../components/ListItem";
import { Song } from "../../../db";
import TextInputModal from "../../../components/TextInputModal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useScreenDimensions } from "../../../utils/useScreenDimensions";

interface Props {
  show: boolean
  songId: string
  onPressClose: () => void
}
const SelectPlaylist: FC<Props> = ({ show, songId, onPressClose }) => {
  const [playlists, setPlaylists] = useState(Playlist.getAll())
  const [song] = useState(Song.getById(songId)!)
  const [showInput, setShowInput] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const screenData = useScreenDimensions()

  function onSelectPlaylist(id: string) {
    let playlist = Playlist.getById(id)!
    if (Playlist.hasSong(playlist, song)) {
      Playlist.removeSong(playlist, song)
    } else {
      Playlist.addSong(playlist, song)
    }
    setPlaylists(Playlist.getAll())
  }

  function enablePlaylistInput() {
    setShowInput(true)
  }

  function onSubmit(playlistName: string) {
    try {
      Playlist.create(playlistName)
      setShowInput(false)
      setPlaylists(Playlist.getAll())
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        throw e
      }
    }
  }

  if (!show) return null
  if (showInput)
    return (
      <TextInputModal
        error={error}
        enabled={showInput}
        onDismiss={() => {
          setError(null)
          setShowInput(false)
        }}
        onSubmit={onSubmit}
        submitButtonTitle="CREATE"
        placeholder="Playlist Name"
      />
    )

  let scrollHeaderHeight = screenData.height * .7
  let emptyListItemsQuant = Math.max(2 - playlists.length, 0)
  let footerHeight = emptyListItemsQuant * 60
  return (
    <FlatList
      data={playlists}
      style={styles.scrollContainer}
      ListHeaderComponent={() => {
        return (
          <View style={[styles.scrollHeader, { height: scrollHeaderHeight }]}>
            <TouchableOpacity onPress={onPressClose} style={styles.scrollHeaderTouchableBackground}>
            </TouchableOpacity>
            <TouchableOpacity onPress={enablePlaylistInput} style={styles.createPlaylistButton}>
              <MaterialCommunityIcons
                name='plus'
                size={20} />
              <Text style={styles.createPlaylistButtonText}>CREATE PLAYLIST</Text>
            </TouchableOpacity>
          </View>
        )
      }}
      ListEmptyComponent={<Text style={styles.emptyMessage}>Playlists not found</Text>}
      contentContainerStyle={{}}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => {
        return (
          <View style={styles.background}>
            <ListItem
              key={item.id!}
              title={item.name}
              onPress={() => onSelectPlaylist(item.id)}
              showIcon={Playlist.hasSong(item, song) ? 'check' : 'plus'}
            />
          </View>
        )
      }}
      ListFooterComponent={<View style={[styles.background, { height: footerHeight }]}></View>}
    />

  );
}
export default SelectPlaylist

const styles = StyleSheet.create({
  scrollContainer: {
    position: 'absolute',
    backgroundColor: '#00000040',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  },
  background: {
    backgroundColor: 'white'
  },
  scrollHeader: {
    justifyContent: 'flex-end'
  },
  scrollHeaderTouchableBackground: {
    flex: 1
  },
  createPlaylistButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  createPlaylistButtonText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
    fontSize: 14,
  },
  emptyMessage: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ccc',
    padding: 10
  }
});