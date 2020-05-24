import realm, { Artist, Song } from "."
import { JsonDecoder } from "@artutra/ts-data-json"
import { Playlist } from "./Playlist"

interface SongBundle {
  id: string
  title: string
  content: string
  artist: string
  transposeAmount?: number | null | undefined
  fontSize?: number | null | undefined
  showTablature: boolean
  updated_at: string
}
interface PlaylistBundle {
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

export function createBundle(): DatabaseBundle {
  let db: DatabaseBundle = { version: 1, songs: [], playlists: [], created_at: new Date().toJSON() }
  realm.objects<Song>('Song').forEach(s => {
    db.songs.push({
      id: s.id,
      title: s.title,
      content: s.content,
      artist: s.artist.name,
      transposeAmount: s.transposeAmount,
      fontSize: s.fontSize,
      showTablature: s.showTablature,
      updated_at: s.updated_at.toJSON()
    })
  })
  realm.objects<Playlist>('Playlist').forEach(p => {
    let playlistSongs: { id: string }[] = []
    if (p.songs instanceof Array) {
      playlistSongs = p.songs.map(s => ({ id: s.id }))
    } else {
      for (var s in p.songs) {
        playlistSongs.push({ id: p.songs[s].id })
      }
    }
    db.playlists.push({
      id: p.id,
      name: p.name,
      songs: playlistSongs
    })
  })
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
