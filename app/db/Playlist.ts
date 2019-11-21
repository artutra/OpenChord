import realm from "."
import { List } from "realm"
import { Song } from "./Song"
import uuid from "uuid"

export class Playlist {
  id!: string
  name!: string
  songs!: List<Song>
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