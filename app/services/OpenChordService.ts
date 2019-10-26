import axios from 'axios'
import { BaseService, Doc, SongDoc } from './BaseService'

export default class OpenChordService extends BaseService {
  constructor() {
    super()
    this.name = 'CifraLivre'
    this.baseUrl = 'https://cifralivre.com.br'
  }

  async getSearch(query: string): Promise<Doc[]> {
    const result = await axios.get(this.baseUrl + '/api/v1/search', {
      params: {
        q: query
      }
    })
    return result.data
  }

  async getArtistSongs(path: string): Promise<SongDoc[]> {
    const result = await axios.get(this.baseUrl + path + '/songs')
    return result.data
  }

  async getChordProSong(path: string) {
    const result = await axios.get(this.baseUrl + path)
    return result.data.chordPro
  }
}