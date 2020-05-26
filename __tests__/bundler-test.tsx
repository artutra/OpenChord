import realm, { Song, Artist } from '../app/db';
import { createBundle, importBundle, DatabaseBundle, decodeJsonBundle } from '../app/db/bundler'
import { Playlist } from '../app/db/Playlist';

beforeAll(() => {
  realm.write(() => {
    realm.deleteAll()
  })
  let artist1 = Artist.create('Artist 1')
  let artist2 = Artist.create('Artist 2')
  let song1 = Song.create(artist1, 'Title 1', '[D]Music lyric lin[C]e 1', 'id-1')
  let song2 = Song.create(artist1, 'Title 2', '[D]Music lyric lin[C]e 2', 'id-2')
  let song3 = Song.create(artist2, 'Title 3', '[D]Music lyric lin[C]e 3', 'id-3')
  let song4 = Song.create(artist2, 'Title 4', '[D]Music lyric lin[C]e 4', 'id-4')
  let playlist1 = Playlist.create('Playlist 1')
  let playlist2 = Playlist.create('Playlist 2')
  Playlist.addSong(playlist1, song1)
  Playlist.addSong(playlist1, song3)
  Playlist.addSong(playlist2, song2)
  Playlist.addSong(playlist2, song4)
})

it('create bundle without errors', () => {
  let bundle = createBundle()
  let song1 = bundle.songs.find(s => s.title === 'Title 1')!
  let song3 = bundle.songs.find(s => s.title === 'Title 3')!
  let playlist1 = bundle.playlists.find(p => p.name === 'Playlist 1')!
  expect(bundle.songs.length).toBe(4)
  expect(bundle.playlists.length).toBe(2)
  expect(song1.artist).toBe('Artist 1')
  expect(song3.artist).toBe('Artist 2')
  expect(playlist1.songs).toEqual(expect.arrayContaining([{ id: song1.id }, { id: song3.id }]))
})
it('create bundle with 1 playlist only', () => {
  let playlist1 = Playlist.getByName('Playlist 1')!
  let bundle = createBundle([playlist1.id], [])
  let song1 = bundle.songs.find(s => s.title === 'Title 1')!
  let song3 = bundle.songs.find(s => s.title === 'Title 3')!
  let bundlePlaylist1 = bundle.playlists.find(p => p.name === 'Playlist 1')!
  expect(bundle.songs.length).toBe(2)
  expect(bundle.playlists.length).toBe(1)
  expect(bundlePlaylist1.name).toBe('Playlist 1')
  expect(bundlePlaylist1.songs).toEqual(expect.arrayContaining([{ id: song1.id }, { id: song3.id }]))
})

it('create bundle with 1 song only', () => {
  let song1 = Song.getById('id-1')!
  let bundle = createBundle([], [song1.id])
  expect(bundle.songs.length).toBe(1)
  expect(bundle.playlists.length).toBe(0)
  expect(bundle.songs[0].title).toBe('Title 1')
})

it('import existing song on db to new imported playlist', () => {
  let testBundle: DatabaseBundle = {
    version: 1,
    created_at: new Date().toJSON(),
    songs: [{
      id: "another-id",
      title: "Title 1",
      content: "[D]Music lyric lin[C]e 1",
      artist: "Artist 1",
      showTablature: true,
      updated_at: "2020-05-23T18:06:44.353Z"
    }],
    playlists: [{
      id: "playlist-id",
      name: "Playlist 3",
      songs: [
        {
          id: "another-id"
        }
      ]
    }]
  }
  importBundle(testBundle)
  let song1 = Song.getById('id-1')
  let playlist3 = Playlist.getByName('Playlist 3')!
  for (var i in playlist3.songs) {
    let song = playlist3.songs[i]
    expect(song).toEqual(song1)
  }
})

it('decode json string without errors', async () => {
  let bundleString = `{
    "version":1,
    "created_at":"",
    "songs": [{
      "id": "song-id",
      "title": "Title 1",
      "content": "Music lyric",
      "artist": "Artist 1",
      "showTablature": false,
      "updated_at": ""
    }],
    "playlists": [{
      "id": "playlist-id",
      "name": "Playlist 1",
      "songs": [{
        "id": "song-id"
      }]
    }]
  }
  `
  let bundle = await decodeJsonBundle(bundleString)
  expect(bundle.version).toBe(1)
})

afterAll(() => {
  realm.close()
})