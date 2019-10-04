import axios from 'axios'
import cheerio from 'react-native-cheerio'
import { BaseService, Doc, SongDoc } from './BaseService'

export default class CifraclubService extends BaseService {
  constructor() {
    super()
    this.name = 'Cifraclub'
    this.baseUrl = 'https://www.cifraclub.com'
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
    return [{ title: 'Test', artist: 'Test', path: '/test', type: 'song' }]
  }
  async getSongHtml(path: string): Promise<string> {

    const result = await axios.get(`${this.baseUrl}/${path}`);

    return result.data
  }
  parseToChordPro(html: string) {
    // const $ = cheerio.load(html)
    // let cifraHtml = $('pre').html()
    // let convertNotes = require("./cifraclubConvertNotes")
    // let convertTabs = require("./cifraclubConvertTabs")

    // let res = convertNotes.convert(cifraHtml)
    // let res2 = convertTabs.convert(res)
    // let t = $('<textarea/>').html(res2).text()
    return ''
  }
  parseToPlainText(html: string) {
    const $ = cheerio.load(html)
    let cs = $('div.cifra_cnt').text()
    return cs
  }
}