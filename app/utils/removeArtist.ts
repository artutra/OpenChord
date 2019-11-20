import { Alert } from "react-native"
import { Artist } from "../db"

export const removeArtist = (artistId: string, callback: () => void) => {
  Alert.alert(
    'Delete Artist',
    'Are you sure you want to permanently delete this artist?',
    [
      { text: 'Cancel', style: 'cancel', onPress: () => { } },
      {
        text: 'Yes', onPress: () => {
          Artist.delete(artistId)
          callback()
        }
      },
    ],
    { cancelable: true }
  )
}