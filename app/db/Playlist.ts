import realm from "."
import { List } from "realm"
import { Song } from "./Song"
import uuid from "uuid"

export class Playlist {
  id!: string
  name!: string
  songs!: List<Song> | Song[]
  updated_at!: Date

  static schema: Realm.ObjectSchema = {
    name: 'Playlist',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', optional: false },
      songs: { type: 'list', objectType: 'Song' },
      updated_at: 'date'
    }
  }
  static getAll() { return realm.objects<Playlist>('Playlist').sorted('name') }
  static getById(id: string) { return realm.objectForPrimaryKey<Playlist>('Playlist', id) }
  static hasSong(playlist: Playlist, song: Song) {
    if (!playlist || !song) return false
    return playlist.songs.some(s => s.id == song.id)
  }
  static addSong(playlist: Playlist, song: Song) {
    realm.write(() => {
      playlist.songs.push(song)
    })
  }
  static removeSong(playlist: Playlist, song: Song) {
    realm.write(() => {
      playlist.songs = playlist.songs.filter(s => s.id != song.id)
    })
  }
  static create(name: string) {
    // TODO: check if exists
    let playlist: Playlist
    realm.write(() => {
      playlist = realm.create<Playlist>('Playlist', {
        id: uuid(),
        name,
        updated_at: new Date()
      })
    })
    return playlist!
  }
}