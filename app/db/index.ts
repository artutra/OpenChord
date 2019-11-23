import Realm from 'realm'
import { Artist } from './Artist';
import { Song } from './Song';
import { Playlist } from './Playlist';

var realm = new Realm({
  schema: [
    Song.schema,
    Artist.schema,
    Playlist.schema,
  ],
  schemaVersion: 3,
  migration: () => { }
})
export default realm;

export { Song }
export { Artist }