import realm, { Song, Artist, createBundle } from '../app/db';
import { Playlist } from '../app/db/Playlist';

beforeAll(() => {
  realm.write(() => {
    realm.deleteAll()
  })
  let artist1 = Artist.create('Artist 1')
  let artist2 = Artist.create('Artist 2')
  let song1 = Song.create(artist1, 'Title 1', '[D]Music lyric lin[C]e 1')
  let song2 = Song.create(artist1, 'Title 2', '[D]Music lyric lin[C]e 2')
  let song3 = Song.create(artist2, 'Title 3', '[D]Music lyric lin[C]e 3')
  let song4 = Song.create(artist2, 'Title 4', '[D]Music lyric lin[C]e 4')
  let playlist1 = Playlist.create('Playlist 1')
  Playlist.addSong(playlist1, song1)
  Playlist.addSong(playlist1, song3)
})

it('export bundle without errors', () => {
  let bundle = createBundle()
  let song1 = bundle.songs.find(s => s.title === 'Title 1')!
  let song3 = bundle.songs.find(s => s.title === 'Title 3')!
  let playlist1 = bundle.playlists.find(p => p.name === 'Playlist 1')!
  expect(song1.artist).toBe('Artist 1')
  expect(song3.artist).toBe('Artist 2')
  expect(playlist1.songs).toEqual(expect.arrayContaining([{ id: song1.id }, { id: song3.id }]))
})

afterAll(() => {
  realm.close()
})