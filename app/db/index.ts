import Realm from 'realm'
import uuid from 'uuid'

export class Song {
  id?: string | null
  title: string
  content: string
  artist: Artist

  constructor(title: string, content: string, artist: Artist, id?: string, ) {
    this.id = id
    this.title = title
    this.content = content
    this.artist = artist
  }

  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      content: 'string',
      artist: { type: 'Artist' }
    }
  }
  static create(song: Song) {
    let artistName = song.artist.name
    let existingArtist = realm.objects('Artist').filtered('name = $0', artistName).find(() => true)
    let createdArtist
    if(existingArtist == null) {
      createdArtist = realm.create('Artist', {
        id: uuid(),
        name: artistName
      })
    }
    realm.create('Song', {
      id: uuid(),
      title: song.title,
      content: song.content,
      artist: existingArtist == null ? createdArtist : existingArtist
    })
  }
}
export class Artist {
  id?: string | null
  name: string
  
  constructor(name: string, id?:string) {
    this.name = name
    this.id = id
  }
  static schema: Realm.ObjectSchema = {
    name: 'Artist',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', optional: false }
    }
  }
}
var realm = new Realm({
  schema: [
    Song.schema,
    Artist.schema,
  ],
  schemaVersion: 2,
  migration: () => {}
})
export default realm;
