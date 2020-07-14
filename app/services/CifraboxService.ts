import api from "./api"
import { JsonDecoder } from "@artutra/ts-data-json"

const getSearch = async (query: string) => {
  const result = await api.get('/api/v2/search', {
    params: {
      q: query
    }
  })
  const searchDecoder = JsonDecoder.object({
    songs: JsonDecoder.array(JsonDecoder.object({
      title: JsonDecoder.string,
      slug: JsonDecoder.string,
      artist_name: JsonDecoder.string,
      artist_slug: JsonDecoder.string,
    }, 'songs'), 'songs[]'),
    artists: JsonDecoder.array(JsonDecoder.object({
      name: JsonDecoder.string,
      slug: JsonDecoder.string,
    }, 'artists'), 'artists[]'),
  }, 'SearchResponse')
  let resData = searchDecoder.decode(result.data)
  if (resData.isOk()) {
    return resData.value
  } else {
    throw new Error(resData.error)
  }
}

const getArtistSongs = async (artistSlug: string) => {
  const result = await api.get(`/api/v2/artists/${artistSlug}`)
  const artistDecoder = JsonDecoder.object({
    id: JsonDecoder.number,
    name: JsonDecoder.string,
    slug: JsonDecoder.string,
    songs: JsonDecoder.array(JsonDecoder.object({
      id: JsonDecoder.number,
      title: JsonDecoder.string,
      slug: JsonDecoder.string,
    }, 'songs'), 'songs[]'),
  }, 'SearchResponse')
  let resData = artistDecoder.decode(result.data)
  if (resData.isOk()) {
    return resData.value
  } else {
    throw new Error(resData.error)
  }
}
const getChordProSong = async (artistSlug: string, songSlug: string) => {
  const result = await api.get(`/api/v2/artists/${artistSlug}/songs/${songSlug}/version`)
  const versionDecoder = JsonDecoder.object({
    chord_pro: JsonDecoder.string,
    user: JsonDecoder.object({
      id: JsonDecoder.number,
      username: JsonDecoder.string,
    }, 'user'),
    song: JsonDecoder.object({
      title: JsonDecoder.string,
      artist: JsonDecoder.object({
        name: JsonDecoder.string
      }, 'artist')
    }, 'song')
  }, 'VersionResponse')
  let resData = versionDecoder.decode(result.data)
  if (resData.isOk()) {
    return resData.value
  } else {
    throw new Error(resData.error)
  }
}

export default {
  getSearch,
  getArtistSongs,
  getChordProSong,
}