import Realm, { List } from 'realm'
import { Artist } from './Artist';
import { Song } from './Song';
import { Playlist } from './Playlist';
import { JsonDecoder } from '@artutra/ts-data-json';

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

export { Song }
export { Artist }