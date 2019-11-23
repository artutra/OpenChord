import uuid from 'uuid'
import allSongs from '../assets/chordpro/songs.json'
import ChordSheetJS from 'chordsheetjs';
import { Artist } from './Artist';
import realm from '.';

export class Song {
  id!: string
  title!: string
  content!: string
  artist!: Artist
  transposeAmount?: number
  fontSize?: number
  showTablature!: boolean
  updated_at!: Date

  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      content: 'string',
      transposeAmount: 'int?',
      fontSize: 'int?',
      showTablature: { type: 'bool', default: true },
      artist: { type: 'Artist' },
      updated_at: 'date'
    }
  }
  static search(query: string) {
    return realm.objects<Song>('Song').filtered('title CONTAINS[c] $0 OR artist.name CONTAINS[c] $0', query)
  }
  static getById(id: string) {
    return realm.objectForPrimaryKey<Song>('Song', id)
  }
  static getByArtist(artistId: string) {
    return realm.objects<Song>('Song').filtered('artist.id = $0', artistId).sorted('title');
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
        const parser = new ChordSheetJS.ChordProParser();
        const formatter = new ChordSheetJS.ChordProFormatter();
        const parsedSong = parser.parse(s);
        let artistName = parsedSong.getMetaData('artist')!
        let songTitle = parsedSong.getMetaData('title')!
        let songContent = formatter.format(parsedSong)

        let artist = Artist.create(artistName)
        Song.create(artist, songTitle, songContent)
      }
    }
  }

  static getAll() { return realm.objects<Song>('Song').sorted('title') }
  static getChordPro(song: Song) {
    let headerlessContent = song.content
    headerlessContent = headerlessContent.replace(/{artist:[^}]*}\n/g, '')
    headerlessContent = headerlessContent.replace(/{title:[^}]*}\n/g, '')
    let header =
      `{title: ${song.title}}\n` +
      `{artist: ${song.artist.name}}\n`
    return header + headerlessContent
  }
  static create(artist: Artist, title: string, content: string) {
    if (title == null || title == "") {
      throw new Error(`Empty title not allowed`)
    }
    if (content == null || content == "") {
      throw new Error(`Empty content not allowed`)
    }
    let song: Song | undefined
    song = realm
      .objects<Song>('Song')
      .filtered('title = $0 && artist.name = $1', title, artist.name)
      .find(() => true)
    if (song == null) {
      realm.write(() => {
        song = realm.create<Song>('Song', {
          id: uuid(),
          title,
          content,
          artist,
          updated_at: new Date()
        })
      })
    } else {
      // TODO: Enable multiple versions of same song
    }
    return song!
  }
  static update(id: string, artist: Artist, title: string, content: string) {
    if (title == null || title == "") {
      throw new Error(`Empty title not allowed`)
    }
    if (content == null || content == "") {
      throw new Error(`Empty content not allowed`)
    }
    let song = Song.getById(id)
    if (song != null) {
      realm.write(() => {
        song!.title = title
        song!.artist = artist
        song!.content = content
        song!.updated_at = new Date()
      })
    } else {
      throw new Error(`Song not found`)
    }
    return song!
  }
  static delete(id: string) {
    realm.write(() => {
      let song = Song.getById(id)
      let artistId = song!.artist.id!
      realm.delete(song)
      if (Song.getByArtist(artistId).length <= 0) {
        realm.delete(Artist.getById(artistId))
      }
    })
  }
  static setPreferences(song: Song, preferences: {
    showTablature?: boolean,
    fontSize?: number,
    transposeAmount?: number
  }) {
    let { showTablature = true, fontSize, transposeAmount } = preferences
    realm.write(() => {
      song.showTablature = showTablature
      song.fontSize = fontSize
      song.transposeAmount = transposeAmount
    })
  }
}