import uuid from 'uuid'
import { Artist } from './Artist';
import { SongBundle } from './bundler';
import realm from '.';

export class Song {
  id!: string
  title!: string
  content!: string
  artist!: Artist
  transposeAmount?: number | null
  fontSize?: number | null
  showTablature?: boolean
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
      showTablature: 'bool?',
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
  static create(artist: Artist, title: string, content: string, id?: string) {
    if (id == null) {
      id = uuid()
    } else if (Song.getById(id)) {
      throw new Error('Song id already exists')
    }

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
          id,
          title,
          content,
          artist,
          updated_at: new Date().toJSON()
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
    fontSize?: number | null,
    transposeAmount?: number | null
  }) {
    let {
      showTablature = song.showTablature,
      fontSize = song.fontSize,
      transposeAmount = song.transposeAmount
    } = preferences
    realm.write(() => {
      song.showTablature = showTablature
      song.fontSize = fontSize
      song.transposeAmount = transposeAmount
    })
  }
  static toBundle(song: Song): SongBundle {
    return {
      id: song.id,
      title: song.title,
      content: song.content,
      artist: song.artist.name,
      transposeAmount: song.transposeAmount,
      fontSize: song.fontSize,
      showTablature: song.showTablature != null ? song.showTablature : true,
      updated_at: song.updated_at.toJSON()
    }
  }
}