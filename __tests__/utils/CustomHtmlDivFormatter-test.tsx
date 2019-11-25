import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import CustomHtmlDivFormatter from '../../app/utils/CustomHtmlDivFormatter';
import ChordSheetJS from 'chordsheetjs';

it('render tags correctly', () => {
  let chordProSong = `
{title: Title}
{artist: Artist}`
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res = ""
  res += "<p class=\"line\">"
  res += "<span class=\"title\">Title</span>"
  res += "</p>\n"
  res += "<p class=\"line\">"
  res += "<span class=\"artist\">Artist</span>"
  res += "</p>"
  expect(formatter.format(song)).toBe(res)
})

it('add a span tag to word with chord in the middle', () => {
  let chordProSong = `This is a bigword[Cm]withachord in the middle`
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res = ""
  res += "<p class=\"line\">"
  res += "This is a "
  res += "<span class=\"word\">"
  res += "bigword"
  res += "<span class=\"chord\">Cm</span>"
  res += "withachord"
  res += "</span>"
  res += " in the middle"
  res += "</p>"
  expect(formatter.format(song)).toBe(res)
})

it('add a span tag to word with many chords in the middle', () => {
  let chordProSong = `This is a bigword[Cm]with[Fm]many[A#]chords in the middle`
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res = ""
  res += "<p class=\"line\">"
  res += "This is a "
  res += "<span class=\"word\">"
  res += "bigword"
  res += "<span class=\"chord\">Cm</span>"
  res += "with"
  res += "<span class=\"chord\">Fm</span>"
  res += "many"
  res += "<span class=\"chord\">A#</span>"
  res += "chords"
  res += "</span>"
  res += " in the middle"
  res += "</p>"
  expect(formatter.format(song)).toBe(res)
})

it('add minimum space between chords', () => {
  let chordPro = "Intro  [C#m7]  [A9]  [E]  [E9]"
  let song = new ChordSheetJS.ChordProParser().parse(chordPro)
  let formatter = new CustomHtmlDivFormatter()
  let res = `<p class="line">Intro  <span class="chord">C#m7</span>     <span class="chord">A9</span>   <span class="chord">E</span>  <span class="chord">E9</span>   </p>`
  expect(formatter.format(song)).toBe(res)
})

it('will add a class with size 16 to lines and chords', () => {
  let chordProSong = `This is a bigword[Cm]withachord in the middle`
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res = ""
  res += "<p class=\"line line-size-16\">"
  res += "This is a "
  res += "<span class=\"word\">"
  res += "bigword"
  res += "<span class=\"chord chord-size-16\">Cm</span>"
  res += "withachord"
  res += "</span>"
  res += " in the middle"
  res += "</p>"
  expect(formatter.format(song, 16)).toBe(res)
})

it('add label to x_source_website tag', () => {
  let chordProSong = `{x_source_website: www.test.com}`
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res =
    "<p class=\"line\">" +
    "<span class=\"x_source_website\">Source website: www.test.com</span>" +
    "</p>"
  expect(formatter.format(song)).toBe(res)
})

it('render comment tag correctly', () => {
  let chordProSong =
    "{comment: Intro [C] [D7]  [F#]}\n" +
    "{c: Intro [C] [D7]  [F#]}"
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res =
    "<p class=\"line\">" +
    "<span class=\"comment\">Intro " +
    "<span class=\"chord chord-inline\">C</span> " +
    "<span class=\"chord chord-inline\">D7</span>  " +
    "<span class=\"chord chord-inline\">F#</span>" +
    "</span>" +
    "</p>"
  res = res + '\n' + res
  expect(formatter.format(song)).toBe(res)
})

it('render tabs correctly', () => {
  let chordProSong =
    "{sot}\n" +
    "E|--4----------\n" +
    "B|--4------4---\n" +
    "G|--3----------\n" +
    "D|--4----------\n" +
    "{eot}"
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res =
    "<div class=\"tab\">" +
    "<div class=\"tab-line\">EBGD</div>\n" +
    "<div class=\"tab-line\">||||</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">4434</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">-4--</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "</div>"
  res = res + '\n'
  expect(formatter.format(song)).toBe(res)
})


it('dont throw error if close tag {eot} was not typed', () => {
  let chordProSong =
    "{sot}\n" +
    "E|-\n" +
    "B|-\n" +
    "G|-\n" +
    "D|-\n"
  let song = new ChordSheetJS.ChordProParser().parse(chordProSong)
  let formatter = new CustomHtmlDivFormatter()
  let res =
    "<div class=\"tab\">" +
    "<div class=\"tab-line\">EBGD</div>\n" +
    "<div class=\"tab-line\">||||</div>\n" +
    "<div class=\"tab-line\">----</div>\n" +
    "</div>"
  res = res + '\n'
  expect(formatter.format(song)).toBe(res)
})