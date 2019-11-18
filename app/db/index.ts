import Realm from 'realm'
import { Artist } from './Artist';
import { Song } from './Song';

var realm = new Realm({
  schema: [
    Song.schema,
    Artist.schema,
  ],
  schemaVersion: 3,
  migration: () => { }
})
export default realm;

export { Song }
export { Artist }