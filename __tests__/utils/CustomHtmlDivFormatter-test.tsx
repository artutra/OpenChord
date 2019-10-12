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