import Realm from 'realm'
import uuid from 'uuid'
import allSongs from '../assets/chordpro/songs.json'
import ChordSheetJS from 'chordsheetjs';

export class Song {
  id?: string | null
  title: string
  content: string
  artist: Artist
  updated_at: Date

  constructor(title: string, content: string, artist: Artist, updated_at?: Date, id?: string | null, ) {
    this.id = id
    this.title = title
    this.content = content
    this.artist = artist
    this.updated_at = updated_at ? updated_at : new Date()
  }

  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      content: 'string',
      artist: { type: 'Artist' },
      updated_at: 'date'
    }
  }
  static getById(id: string) {
    return realm.objectForPrimaryKey<Song>('Song', id)
  }
  static getByArtist(artistId: string) {
    return realm.objects<Song>('Song').filtered('artist.id = $0', artistId);
  }
  static shouldUpdateDb() {
    let s = this.getAll().find(() => true)
    let newSongsDate = new Date(allSongs.updated_at)
    if (s == null)
      return true
    else
      return newSongsDate > s.updated_at
  }
  static populateDb() {
    if (this.shouldUpdateDb()) {
      for (var i = 0; i < allSongs.data.length; i++) {
        let s: string = allSongs.data[i]
        let updated_at = new Date(allSongs.updated_at)
        const parser = new ChordSheetJS.ChordProParser();
        const formatter = new ChordSheetJS.ChordProFormatter();
        const parsedSong = parser.parse(s);

        let artist = new Artist(parsedSong.getMetaData('artist')!, updated_at)
        let song = new Song(parsedSong.getMetaData('title')!, formatter.format(parsedSong), artist, updated_at)
        realm.write(() => {
          Song.create(song)
        })
      }
    }
  }

  static getAll() { return realm.objects<Song>('Song') }

  static create(song: Song) {
    let artistName = song.artist.name
    let artist: Artist | undefined
    artist = realm.objects<Artist>('Artist').filtered('name = $0', artistName).find(() => true)
    if (artist == null) {
      artist = realm.create<Artist>('Artist', {
        id: uuid(),
        name: artistName,
        updated_at: song.artist.updated_at
      })
    }
    let songDb: Song | undefined
    songDb = realm
      .objects<Song>('Song')
      .filtered('title = $0 && artist.name = $1', song.title, artistName)
      .find(() => true)
    if (songDb == null) {
      songDb = realm.create('Song', {
        id: uuid(),
        title: song.title,
        content: song.content,
        artist,
        updated_at: song.updated_at
      })
    } else {
      songDb.content = song.content
      songDb.updated_at = song.updated_at
    }
    return songDb
  }
  static delete(id: string) {
    realm.write(() => {
      let song = Song.getById(id)
      let artistId = song!.artist.id!
      realm.delete(song)
      if (Song.getByArtist(artistId).length <= 0) {
        Artist.delete(artistId)
      }
    })
  }
}
export class Artist {
  id?: string | null
  name: string
  updated_at: Date

  constructor(name: string, updated_at?: Date, id?: string) {
    this.name = name
    this.id = id
    this.updated_at = updated_at ? updated_at : new Date()
  }
  static schema: Realm.ObjectSchema = {
    name: 'Artist',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', optional: false },
      updated_at: 'date'
    }
  }
  static getAll() { return realm.objects<Artist>('Artist') }

  static getById(id: string) {
    return realm.objectForPrimaryKey<Artist>('Artist', id)
  }
  static delete(id: string) {
    realm.delete(this.getById(id))
  }
}
var realm = new Realm({
  schema: [
    Song.schema,
    Artist.schema,
  ],
  schemaVersion: 3,
  migration: () => { }
})
export default realm;
