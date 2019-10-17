import ChordSheetJS, { Song } from "chordsheetjs"
const NEW_LINE = '\n'

export default class CustomHtmlDivFormatter {
  format(song: Song, fontSize = 14) {
    let CHORD_SIZE_CLASS = fontSize != 14 ? ` chord-size-${fontSize}` : ''
    let LYRICS_SIZE_CLASS = fontSize != 14 ? ` line-size-${fontSize}` : ''
    let html = ''
    song.lines.forEach((l, index) => {
      html += `<p class="line${LYRICS_SIZE_CLASS}">`
      l.items.forEach(item => {
        if (item instanceof ChordSheetJS.ChordLyricsPair) {
          if (item.chords) {
            let { lyrics } = item
            if (lyrics.length <= item.chords.length)
              lyrics = lyrics + " ".repeat(item.chords.length - lyrics.length + 1)
            html += `<span class="chord${CHORD_SIZE_CLASS}">${item.chords}</span>${lyrics}`
          } else {
            html += `${item.lyrics}`
          }
        } else {
          if (item.name == 'x_source_website') {
            html += `<span class="${item.name}">Source website: ${item.value}</span>`
          } else if (item.value != null) {
            html += `<span class="${item.name}">${item.value}</span>`
          }
        }
      })
      html += `</p>`
      if (index < song.lines.length - 1) {
        html += NEW_LINE
      }
    })
    html = html.replace(/\w+(<span class="chord(.*?)<\/span>\w+)+/g, (v) => {
      return `<span class="word">${v}</span>`
    })
    return html
  }
}