import { Alert } from "react-native"
import { Song } from "../db"
import { Playlist } from "../db/Playlist"

export const removePlaylist = (playlistId: string, callback: () => void) => {
  Alert.alert(
    'Delete Playlist',
    'Are you sure you want to permanently delete this playlist?',
    [
      { text: 'Cancel', style: 'cancel', onPress: () => { } },
      {
        text: 'Yes', onPress: () => {
          Playlist.delete(playlistId)
          callback()
        }
      },
    ],
    { cancelable: true }
  )
}