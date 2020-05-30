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
  const [song, setSong] = useState(Song.getById(songId)!)
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
  return (
    <View style={styles.tabContainter}>
      <FlatList
        data={playlists}
        style={{ position: 'absolute', backgroundColor: '#00000040', bottom: 0, right: 0, left: 0, top: 0, }}
        ListHeaderComponent={() => {
          return (
            <View style={[styles.scrollHeader, { height: screenData.height * .7 }]}>
              <TouchableOpacity onPress={onPressClose} style={{ flex: 1 }}>
              </TouchableOpacity>
              <TouchableOpacity onPress={enablePlaylistInput} style={{ backgroundColor: 'white', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', justifyContent: 'center' }}>
                <MaterialCommunityIcons
                  name='plus'
                  size={20}
                  color={''} />
                <Text style={styles.closeButtonText}>Create new Playlist</Text>
              </TouchableOpacity>
            </View>
          )
        }}
        contentContainerStyle={{}}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => {
          return <View style={{ backgroundColor: 'white' }}>
            <ListItem
              key={item.id!}
              title={item.name}
              onPress={() => onSelectPlaylist(item.id)}
              showIcon={Playlist.hasSong(item, song) ? 'check' : 'plus'}
            />
          </View>
        }}
      />
    </View>

  );
}
export default SelectPlaylist

const styles = StyleSheet.create({
  scrollHeader: {
    justifyContent: 'flex-end'
  },
  tabContainter: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
    zIndex: 999,
    justifyContent: 'flex-end'
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
    fontSize: 14,
  },
  closeButtonText: {
    fontSize: 16
  },
  chordList: {
    backgroundColor: '#eee'
  },
  item: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemTitle: {
    fontSize: 18
  },
  itemSelected: {
    borderBottomColor: 'tomato',
    borderBottomWidth: 5
  }
});