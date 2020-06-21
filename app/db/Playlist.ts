import realm from "."
import { List, Results } from "realm"
import { Song } from "./Song"
import uuid from "uuid"
import { PlaylistBundle } from "./bundler"

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
  static getByName(name: string) {
    return realm.objects<Playlist>('Playlist').filtered('name = $0', name).find(() => true)
  }
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
    if (name == null || name == "") {
      throw new Error(`Empty name not allowed`)
    }
    let sameNamePlaylist = Playlist.getByName(name)
    if (sameNamePlaylist) {
      throw new Error(`Playlist with name "${name}" already exists`)
    }
    let playlist: Playlist
    realm.write(() => {
      playlist = realm.create<Playlist>('Playlist', {
        id: uuid(),
        name,
        updated_at: new Date().toJSON()
      })
    })
    return playlist!
  }
  static update(id: string, name: string, songs: Song[]) {
    if (name == null || name == "") {
      throw new Error(`Empty name not allowed`)
    }
    let sameNamePlaylist = Playlist.getByName(name)
    if (sameNamePlaylist && sameNamePlaylist.id != id) {
      throw new Error(`Playlist with name "${name}" already exists`)
    }
    let playlist = Playlist.getById(id)
    if (playlist != null) {
      realm.write(() => {
        playlist!.name = name
        playlist!.songs = songs
        playlist!.updated_at = new Date()
      })
    }
    return playlist
  }
  static delete(id: string) {
    let playlist = Playlist.getById(id)
    if (playlist) {
      realm.write(() => {
        realm.delete(playlist)
      })
    }
  }
  static toBundle(playlist: Playlist): PlaylistBundle {
    let playlistSongs: { id: string }[] = []
    if (playlist.songs instanceof Array) {
      playlistSongs = playlist.songs.map(s => ({ id: s.id }))
    } else {
      for (var s in playlist.songs) {
        playlistSongs.push({ id: playlist.songs[s].id })
      }
    }
    return {
      id: playlist.id,
      name: playlist.name,
      songs: playlistSongs
    }
  }
  static getSongs(playlist: Playlist, sortBy: SortBy, reverse: boolean) {
    let songs: Results<Song> | List<Song> | Song[] = playlist.songs
    if (songs instanceof Array) {
      let asc = reverse ? -1 : 1
      if (sortBy === 'ARTIST') {
        songs = songs.sort((a, b) => {
          if (a.artist.name < b.artist.name) { return asc * -1 }
          if (a.artist.name > b.artist.name) { return asc * 1 }
          return 0
        })
      } else if (sortBy === 'TITLE') {
        songs = songs.sort((a, b) => {
          if (a.title < b.title) { return asc * -1 }
          if (a.title > b.title) { return asc * 1 }
          return 0
        })
      }
    } else {
      if (sortBy === 'ARTIST') {
        songs = songs.sorted('artist.name', reverse)
      } else if (sortBy === 'TITLE') {
        songs = songs.sorted('title', reverse)
      }
    }
    return songs
  }
}

export type SortBy = 'TITLE' | 'ARTIST' | 'CUSTOM'