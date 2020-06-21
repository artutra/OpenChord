import realm from "."
import { Song } from "./Song"
import uuid from 'uuid'

export class Artist {
  id!: string
  name!: string
  updated_at!: Date

  static schema: Realm.ObjectSchema = {
    name: 'Artist',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', optional: false },
      updated_at: 'date'
    }
  }
  songs() {
    console.warn(this.id)
    return Song.getByArtist(this.id!)
  }
  static getAll() { return realm.objects<Artist>('Artist').sorted('name') }
  static getByName(name: string) {
    return realm.objects<Artist>('Artist').filtered('name = $0', name).find(() => true)
  }
  static getById(id: string) {
    return realm.objectForPrimaryKey<Artist>('Artist', id)
  }
  static delete(id: string) {
    realm.write(() => {
      realm.delete(Song.getByArtist(id))
      realm.delete(this.getById(id))
    })
  }
  static create(name: string) {
    if (name == null || name == "") {
      throw new Error(`Empty name not allowed`)
    }
    let sameNameArtist = Artist.getByName(name)
    if (sameNameArtist) {
      throw new Error(`Artist with name "${name}" already exists`)
    }
    let artist: Artist
    realm.write(() => {
      artist = realm.create<Artist>('Artist', {
        id: uuid(),
        name,
        updated_at: new Date().toJSON()
      })
    })
    return artist!
  }
  static update(id: string, name: string) {
    let artist = Artist.getById(id)
    if (artist) {
      if (name == artist.name) return artist
      let artistWithSameName = Artist.getByName(name)
      if (artistWithSameName) {
        // TODO: Merge songs to this artist
      } else {
        realm.write(() => {
          artist!.name = name
        })
      }
    }
    return artist
  }
}