import axios from 'axios'
import { JsonDecoder } from '@artutra/ts-data-json'

const baseURL = 'http://192.168.15.53:3333'

const api = axios.create({ baseURL })

api.interceptors.response.use((res) => {
  return res
}, (error) => {
  let errors = error.response?.data?.errors
  if (errors && errors instanceof Array) {
    let errorMsg = ''
    errors.forEach((e: { message: string }) => {
      errorMsg += e.message + '\n'
    })
    error.message = errorMsg
  } else if (error.response?.data?.message) {
    error.message = error.response?.data?.message
  }
  return Promise.reject(error)
})

export const setTokenHeader = (token: string) => {
  api.defaults.headers = { Authorization: `bearer ${token}` }
}

export default api

export const paginateMetaDecoder = JsonDecoder.object({
  total: JsonDecoder.number,
  per_page: JsonDecoder.number,
  current_page: JsonDecoder.number,
  last_page: JsonDecoder.number,
  first_page_url: JsonDecoder.string,
  last_page_url: JsonDecoder.string,
  next_page_url: JsonDecoder.optional(JsonDecoder.string),
  previous_page_url: JsonDecoder.optional(JsonDecoder.string),
}, 'PaginateMeta')