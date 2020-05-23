import Realm, { List } from 'realm'
import { Artist } from './Artist';
import { Song } from './Song';
import { Playlist } from './Playlist';

var realm = new Realm({
  schema: [
    Song.schema,
    Artist.schema,
    Playlist.schema,
  ],
  schemaVersion: 4,
  migration: () => { }
})
export default realm;

export interface DatabaseBundle {
  version: number
  created_at: string
  songs: {
    id: string
    title: string
    content: string
    artist: string
    transposeAmount?: number | null | undefined
    fontSize?: number | null | undefined
    showTablature: boolean
    updated_at: string
  }[]
  playlists: {
    id: string
    name: string
    songs: { id: string }[]
  }[]
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
export function jsonToBundle(jsonString: string): DatabaseBundle {
  // TODO
  let db: DatabaseBundle = { version: 1, songs: [], playlists: [], created_at: new Date().toJSON() }
  return db
}

export { Song }
export { Artist }