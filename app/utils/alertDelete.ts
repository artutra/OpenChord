import { Alert, Platform } from "react-native"
import { Artist, Song } from "../db"
import { Playlist } from "../db/Playlist"

export const alertDelete = (modelType: 'artist' | 'song' | 'playlist', id: string, callback: () => void) => {
  const alertFunc = () => {
    let title = 'Delete Artist'
    if (modelType === 'song') title = 'Delete Song'
    if (modelType === 'playlist') title = 'Delete Playlist'
    Alert.alert(
      title,
      'Are you sure you want to permanently delete it?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => { } },
        {
          text: 'Yes', onPress: () => {
            if (modelType === 'artist') {
              Artist.delete(id)
            } else if (modelType === 'song') {
              Song.delete(id)
            } else {
              Playlist.delete(id)
            }
            callback()
          }
        },
      ],
      { cancelable: true }
    )
  }
  if (Platform.OS === 'ios') {
    setTimeout(alertFunc, 500)
  } else {
    alertFunc()
  }
}