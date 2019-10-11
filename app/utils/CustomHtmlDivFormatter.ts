import ChordSheetJS, { Song } from "chordsheetjs"

export default class CustomHtmlDivFormatter {
  format(song: Song) {
    let html = ''
    song.lines.forEach(l => {
      html += `<p class="line">`
      l.items.forEach(item => {
        if (item instanceof ChordSheetJS.ChordLyricsPair) {
          if (item.chords) {
            html += `<span class="chord">${item.chords}</span>${item.lyrics}`
          } else {
            html += `${item.lyrics}`
          }
        } else {
          if (item.value != null) {
            html += `<span class="${item.name}">${item.value}</span>`
          }
        }
      })
      html += `</p>\n`
    })
    html = html.replace(/\w+(<span class="chord">(.*?)<\/span>\w+)+/g, (v) => {
      return `<span class="word">${v}</span>`
    })
    return html
  }
}