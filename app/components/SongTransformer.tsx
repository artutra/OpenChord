import React, { useState, useEffect, FunctionComponent } from "react";
import ChordSheetJS, { Song } from 'chordsheetjs'
import Chord from 'chordjs'
import CustomHtmlDivFormatter from "../utils/CustomHtmlDivFormatter";

interface SongProps {
  chords: Array<Chord>
  htmlSong: string
}
interface Props {
  chordProSong?: string
  chordSheetSong?: string
  transposeDelta?: number
  showTabs?: boolean
  fontSize?: number
  children(props: SongProps): JSX.Element;
}

const processChord = (item: (ChordSheetJS.ChordLyricsPair | ChordSheetJS.Tag), processor: (parsedChord: Chord) => Chord) => {
  if (item instanceof ChordSheetJS.ChordLyricsPair) {
    if (item.chords) {
      const parsedChord = Chord.parse(item.chords);

      if (parsedChord) {
        const processedChordLyricsPair = item.clone();
        processedChordLyricsPair.chords = processor(parsedChord).toString();
        return processedChordLyricsPair;
      }
    }
  } else {
    if (item.name == 'comment' && item.value) {
      let commentSong = new ChordSheetJS.ChordProParser().parse(item.value)
      commentSong = transformSong(commentSong, processor);
      item.value = new ChordSheetJS.ChordProFormatter().format(commentSong)
    }
  }
  return item;
};

const transformSong = (song: Song, processor: (parsedChord: Chord) => Chord) => {
  song.lines = song.lines.map((line) => {
    line.items = line.items.map(item => processChord(item, processor));
    return line;
  });
  return song;
};
export const transposeSong = (song: Song, transposeDelta: number) => transformSong(song, chord => chord.transpose(transposeDelta))
export const getChords = (song: Song): Chord[] => {
  let allChords: Chord[] = []
  song.lines.forEach(line => {
    line.items.forEach(item => {
      if (item instanceof ChordSheetJS.ChordLyricsPair) {
        if (item.chords) {
          const parsedChord = Chord.parse(item.chords);
          if (parsedChord != null && allChords.find(c => c.toString() == parsedChord.toString()) == null) {
            allChords.push(parsedChord)
          }
        }
      } else {
        if (item.name == 'comment' && item.value) {
          let commentSong = new ChordSheetJS.ChordProParser().parse(item.value)
          getChords(commentSong).forEach(c => {
            if (!allChords.some(ac => ac.toString() == c.toString())) {
              allChords.push(c)
            }
          })
        }
      }
    })
  })
  return allChords
}
const SongTransformer: FunctionComponent<Props> = (props) => {
  let { showTabs = true, transposeDelta = 0, chordProSong, fontSize = 14 } = props
  let htmlSong = ''
  let song: Song
  if (chordProSong != null) {
    if (!showTabs) {
      chordProSong = chordProSong.replace(/{sot}(.|\n|\r)*?{eot}\r?\n?/g, '')
    }
    song = new ChordSheetJS.ChordProParser().parse(chordProSong);
  } else {
    song = new ChordSheetJS.ChordSheetParser({ preserveWhitespace: true }).parse(props.chordSheetSong!);
  }
  let transposedSong = song
  if (transposeDelta != 0) {
    transposedSong = transposeSong(song, transposeDelta);
  }
  let allChords = getChords(transposedSong)
  htmlSong = new CustomHtmlDivFormatter().format(transposedSong, fontSize)

  return props.children({ chords: allChords, htmlSong })
}
export default SongTransformer