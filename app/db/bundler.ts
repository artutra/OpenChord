import realm, { Artist, Song } from "."
import { JsonDecoder } from "@artutra/ts-data-json"
import { Playlist } from "./Playlist"

export interface SongBundle {
  id: string
  title: string
  content: string
  artist: string
  transposeAmount?: number | null | undefined
  fontSize?: number | null | undefined
  showTablature: boolean
  updated_at: string
}
export interface PlaylistBundle {
  id: string
  name: string
  songs: { id: string }[]
}
export interface DatabaseBundle {
  version: number
  created_at: string
  songs: SongBundle[]
  playlists: PlaylistBundle[]
}

export function createBundle(playlistIds?: string[], songIds?: string[]): DatabaseBundle {
  let db: DatabaseBundle = { version: 1, songs: [], playlists: [], created_at: new Date().toJSON() }
  if (songIds) {
    songIds.forEach(songId => {
      let s = Song.getById(songId)
      if (!s) throw new Error('Invalid song ids')
      db.songs.push(Song.toBundle(s))
    })
  } else {
    realm.objects<Song>('Song').forEach(s => {
      db.songs.push(Song.toBundle(s))
    })
  }
  if (playlistIds) {
    playlistIds.forEach(playlistId => {
      let p = Playlist.getById(playlistId)
      if (!p) throw new Error('Invalid playlist id')

      for (var s in p.songs) {
        let song = p.songs[s]
        if (db.songs.find(s => s.id === song.id) == null) {
          db.songs.push(Song.toBundle(song))
        }
      }
      db.playlists.push(Playlist.toBundle(p))
    })
  } else {
    realm.objects<Playlist>('Playlist').forEach(p => {
      db.playlists.push(Playlist.toBundle(p))
    })
  }
  return db;
}
export function importBundle(bundle: DatabaseBundle): void {
  let mapExistingSongs: { [key: string]: string } = {}
  bundle.songs.forEach(bundleSong => {
    let artistDb: Artist | undefined = Artist.getByName(bundleSong.artist)
    if (artistDb == null) {
      artistDb = Artist.create(bundleSong.artist)
    }
    let songDb = Song.getById(bundleSong.id)
    if (songDb) {
      mapExistingSongs[bundleSong.id] = songDb.id
      if (songDb.updated_at < new Date(bundleSong.updated_at)) {
        Song.update(songDb.id, artistDb, bundleSong.title, bundleSong.content)
      }
    } else {
      let s = Song.create(artistDb, bundleSong.title, bundleSong.content, bundleSong.id)
      mapExistingSongs[bundleSong.id] = s.id
    }
  })
  bundle.playlists.forEach(bundlePlaylist => {
    let playlistDb: Playlist | undefined = Playlist.getByName(bundlePlaylist.name)
    if (playlistDb == null) {
      playlistDb = Playlist.create(bundlePlaylist.name)
    }
    bundlePlaylist.songs.forEach(bundleSong => {
      let songDb = Song.getById(mapExistingSongs[bundleSong.id])
      if (songDb == null) {
        throw new Error('Playlist song not found')
      }
      Playlist.addSong(playlistDb!, songDb)
    })
  })
}
const bundleDecoder = JsonDecoder.object<DatabaseBundle>({
  version: JsonDecoder.number,
  created_at: JsonDecoder.string,
  songs: JsonDecoder.array<SongBundle>(
    JsonDecoder.object<SongBundle>({
      id: JsonDecoder.string,
      title: JsonDecoder.string,
      content: JsonDecoder.string,
      artist: JsonDecoder.string,
      transposeAmount: JsonDecoder.optional(JsonDecoder.number),
      fontSize: JsonDecoder.optional(JsonDecoder.number),
      showTablature: JsonDecoder.boolean,
      updated_at: JsonDecoder.string
    }, 'SongBundle'), 'songs[]'),
  playlists: JsonDecoder.array<PlaylistBundle>(
    JsonDecoder.object<PlaylistBundle>({
      id: JsonDecoder.string,
      name: JsonDecoder.string,
      songs: JsonDecoder.array<{ id: string }>(JsonDecoder.object<{ id: string }>({
        id: JsonDecoder.string
      }, 'playlist.songs.id'), 'playlist.songs[]')
    }, 'PlaylistBundle'), 'playlists[]')
},
  'DatabaseBundle')

export async function decodeJsonBundle(jsonString: string): Promise<DatabaseBundle> {
  let bundle = JSON.parse(jsonString)
  return await bundleDecoder.decodePromise<DatabaseBundle>(bundle)
}
