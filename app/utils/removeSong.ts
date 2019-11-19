import { Alert } from "react-native"
import { Song } from "../db"

export const removeSong = (songId: string, callback: () => void) => {
  Alert.alert(
    'Delete Song',
    'Are you sure you want to permanently delete this song?',
    [
      { text: 'Cancel', style: 'cancel', onPress: () => { } },
      {
        text: 'Yes', onPress: () => {
          Song.delete(songId)
          callback()
        }
      },
    ],
    { cancelable: true }
  )
}