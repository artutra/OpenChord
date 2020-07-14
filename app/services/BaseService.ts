export interface ArtistDoc {
  name: string
  slug: string
  artist_name?: null
}
export interface SongDoc {
  title: string
  artist_name: string
  artist_slug: string
  slug: string
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