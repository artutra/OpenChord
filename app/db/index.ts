import Realm from 'realm'
import { Artist } from './Artist';
import { Song } from './Song';
import { Playlist } from './Playlist';
import { GlobalSettings } from './GlobalSettings';

var realm = new Realm({
  schema: [
    Song.schema,
    Artist.schema,
    Playlist.schema,
    GlobalSettings.schema,
  ],
  schemaVersion: 8,
  migration: () => { }
})
export default realm;

export { Song }
export { Artist }