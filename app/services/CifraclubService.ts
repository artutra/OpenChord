import axios from 'axios'
import cheerio from 'react-native-cheerio'
import { BaseService, Doc, SongDoc } from './BaseService'
import CifraclubParser from '../utils/CifraclubParser'

export default class CifraclubService extends BaseService {
  constructor() {
    super()
    this.name = 'Cifraclub'
    this.baseUrl = 'https://m.cifraclub.com.br'
    this.searchUrl = 'https://studiosolsolr-a.akamaihd.net/cc/h2/'
  }
  async getSearch(query: string): Promise<Doc[]> {

    const result = await axios.get(this.searchUrl, {
      params: {
        q: query
      }
    });
    let str = result.data.substring(1, result.data.length - 2)

    let resultJson = await JSON.parse(str)
    let cifraclubDocs: { a: string, d: string, u: string, t: string, m: string }[] = resultJson.response.docs
    let docs = cifraclubDocs.map((d) => {
      let doc: Doc
      if (d.t == '1') {
        doc = {
          name: d.a,
          path: d.d,
          type: 'artist'
        }
      } else {
        doc = {
          title: d.m,
          artist: d.a,
          path: d.d + '/' + d.u,
          type: 'song'
        }
      }
      return doc
    })
    return docs
  }
  async getArtistSongs(path: string): Promise<SongDoc[]> {
    const result = await axios.get(`${this.baseUrl}/${path}`);
    const $ = cheerio.load(result.data)
    let docs: SongDoc[] = []
    $('.artist_songsAZ').children('ol.list').children().each((i: number, elem: CheerioElement) => {
      let item = $('.list-item', elem)
      let title = item.text()
      let href = item.attr('href')
      if (title) {
        docs.push({
          title,
          artist: '',
          path: href,
          type: 'song'
        })
      }
    })
    return docs
  }
  async getChordProSong(path: string) {
    let url = `${this.baseUrl}/${path}`
    const result = await axios.get(url);
    return this.parseToChordPro(result.data, url)
  }
  async getSongHtml(path: string): Promise<string> {
    const result = await axios.get(`${this.baseUrl}/${path}`);
    return result.data
  }
  decode(str: string) {
    return str.replace(/(&\S+;)/g, function (match, dec) {
      return cheerio.load(`<div>${dec}</div>`)('div').text()
    });
  }
  parseToChordPro(html: string, url: string) {
    const $ = cheerio.load(html)
    let chordSheetHtml = $('pre').html()!
    let musicTitle = $('.title').children('div').children('h1').text()
    let artistName = $('.title').children('div').children('.title_h2').text()
    let header =
      `{title: ${musicTitle}}\n` +
      `{artist: ${artistName}}\n` +
      `{x_source_website: ${url}}\n`
    chordSheetHtml = this.decode(chordSheetHtml)
    chordSheetHtml = chordSheetHtml.replace(/\[/g, '')
    chordSheetHtml = chordSheetHtml.replace(/\]/g, '')
    chordSheetHtml = new CifraclubParser().parse(chordSheetHtml)
    chordSheetHtml = header + chordSheetHtml
    return chordSheetHtml
  }
}