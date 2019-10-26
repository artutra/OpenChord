export interface ArtistDoc {
  name: string
  path: string
  type: 'artist'
}
export interface SongDoc {
  title: string
  artist: string
  path: string
  type: 'song'
}
export type Doc = ArtistDoc | SongDoc

export abstract class BaseService {
  name!: string
  baseUrl!: string
  searchUrl!: string
  constructor() { }
  abstract async getSearch(query: string): Promise<Doc[]>
  abstract async getArtistSongs(path: string): Promise<SongDoc[]>
  abstract async getChordProSong(path: string): Promise<string>
}