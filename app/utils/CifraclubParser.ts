const REGEX_CHORDS = /<b>(\S+?)<\/b>/g
const REGEX_TAB = /<span class="tablatura">([\s\S]*?)<span class="cnt">([\s\S]*?)<\/span>[\s\S]*?<\/span>/g
const START_OF_TABS = "{sot}"
const END_OF_TABS = "{eot}"
const NEW_LINE = '\n'
const SQUARE_START = '['
const SQUARE_END = ']'

interface MusicChord {
  text: string,
  index: number,
}

export default class CifraclubParser {
  parse = (html: string) => {
    html = this.parseChords(html)
    html = this.parseTabs(html)
    return html
  }

  private parseChords = (content: string) => {
    let lines = content.split(NEW_LINE)
    let rendered = ""
    if (lines != null) {
      let chordsNextLine: MusicChord[] = []
      lines.forEach((line, index) => {
        if (chordsNextLine.length > 0) {
          rendered += this.insertChordsInLine(line, chordsNextLine) + NEW_LINE
          chordsNextLine = []
        } else {
          let lineChords = this.getChords(line)
          // clean chords from line
          line = line.replace(REGEX_CHORDS, '')
          let nextLineHasChords = false
          if (index < lines.length - 1) {
            nextLineHasChords = this.hasChords(lines[index + 1])
          }
          if (this.hasNonWhitespaceCharacter(line) || nextLineHasChords) {
            // TODO: Add comment tag for inline chord notation
            rendered += this.insertChordsInLine(line, lineChords, true) + NEW_LINE
          } else {
            chordsNextLine = lineChords
          }
        }
      })
      if (chordsNextLine.length > 0) {
        // clean chords from line
        let lastLine = lines[lines.length - 1]
        lastLine = lastLine.replace(REGEX_CHORDS, '')
        rendered += this.insertChordsInLine(lastLine, chordsNextLine, true) + NEW_LINE
      }
    }
    return rendered
  }

  private hasNonWhitespaceCharacter = (line: string) => {
    return line.match(/\S+/g) != null
  }
  private hasChords = (line: string) => {
    return line.match(REGEX_CHORDS) != null
  }

  private getChords = (line: string): MusicChord[] => {
    let m: RegExpExecArray | null
    let chords: MusicChord[] = []
    let spacing = 7 // '<b></b>'.length
    while ((m = REGEX_CHORDS.exec(line)) !== null) {
      chords.push({
        text: m[1],
        index: m.index - spacing * chords.length
      })
    }
    return chords
  }

  private insertChordsInLine = (line: string, chords: MusicChord[], ignoreChordLength = false) => {
    let insertedCharacters = 0
    if (!ignoreChordLength) {
      let maxIndex = 0
      chords.forEach(c => { maxIndex = Math.max(maxIndex, c.index) })
      line += " ".repeat(Math.max(maxIndex - line.length, 0))
    }
    chords.forEach((chord) => {
      line =
        line.substr(0, chord.index + insertedCharacters) +
        SQUARE_START + chord.text + SQUARE_END +
        line.substr(chord.index + insertedCharacters)
      insertedCharacters += SQUARE_START.length + SQUARE_END.length
      if (!ignoreChordLength) {
        insertedCharacters += chord.text.length
      }
    })
    return line
  }

  private parseTabs = (content: string) => {
    return content.replace(REGEX_TAB, (v1, comment, tabs) => {
      comment = this.parseChords(comment)
      tabs = tabs.replace(/<u>|<\/u>/g, '')
      return `${comment}${START_OF_TABS}${NEW_LINE}${tabs}${END_OF_TABS}${NEW_LINE}`
    })
  }
}