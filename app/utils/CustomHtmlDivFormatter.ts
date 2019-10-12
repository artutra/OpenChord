import ChordSheetJS, { Song } from "chordsheetjs"
const NEW_LINE = '\n'

export default class CustomHtmlDivFormatter {
  format(song: Song) {
    let html = ''
    song.lines.forEach((l, index) => {
      html += `<p class="line">`
      l.items.forEach(item => {
        if (item instanceof ChordSheetJS.ChordLyricsPair) {
          if (item.chords) {
            let { lyrics } = item
            if (lyrics.length <= item.chords.length)
              lyrics = lyrics + " ".repeat(item.chords.length - lyrics.length + 1)
            html += `<span class="chord">${item.chords}</span>${lyrics}`
          } else {
            html += `${item.lyrics}`
          }
        } else {
          if (item.value != null) {
            html += `<span class="${item.name}">${item.value}</span>`
          }
        }
      })
      html += `</p>`
      if (index < song.lines.length - 1) {
        html += NEW_LINE
      }
    })
    html = html.replace(/\w+(<span class="chord">(.*?)<\/span>\w+)+/g, (v) => {
      return `<span class="word">${v}</span>`
    })
    return html
  }
}