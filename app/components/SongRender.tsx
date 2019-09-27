import React, { FunctionComponent } from 'react'
import WebView from 'react-native-webview'
import ChordSheetJS, { Song } from 'chordsheetjs'
import Chord from 'chordjs'

interface Props {
  chordProContent: string
  tone: number
  onPressChord: (chord: string) => void
}
const processChord = (item: (ChordSheetJS.ChordLyricsPair | ChordSheetJS.Tag), processor: (parsedChord: Chord) => Chord) => {
  if (item instanceof ChordSheetJS.ChordLyricsPair && item.chords) {
    const parsedChord = Chord.parse(item.chords);

    if (parsedChord) {
      const processedChordLyricsPair = item.clone();
      processedChordLyricsPair.chords = processor(parsedChord).toString();
      return processedChordLyricsPair;
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

const transformChordSheet = (chordSheet: string, delta: number) => {
  const song = new ChordSheetJS.ChordProParser().parse(chordSheet);
  const processedSong = transformSong(song, chord => chord.transpose(delta));
  return new ChordSheetJS.HtmlDivFormatter().format(processedSong);
};
const SongRender: FunctionComponent<Props> = (props) => {

  const contentHtml = transformChordSheet(props.chordProContent, props.tone)

  return (
    <WebView
      startInLoadingState={true}
      overScrollMode={'never'}
      scrollEnabled={false}
      source={{ html: renderHtml(contentHtml, styles) }}
      injectedJavaScript={onClickChordPostMessage}
      onMessage={(event) => { props.onPressChord(event.nativeEvent.data) }}
    />
  )
}
function renderHtml(body: string, styles: string) {
  return `<html>
    <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
    <body>${body}</body>
    <style>${styles}</style>
  </html>`
}
const onClickChordPostMessage = `
(
  function() {
    function onClickChord (chord) {
      return function () {
        window.ReactNativeWebView.postMessage(chord)
      }
    }
  var anchors = document.getElementsByClassName('chord');
  for(var i = 0; i < anchors.length; i++) {
      var anchor = anchors[i];
      var chord = anchor.innerText || anchor.textContent;
      anchor.onclick = onClickChord(chord)
  }
})();

true;
`
const styles = `
.chord {
  color: red;
  font-size: 16px;
}
.chord:active {
  color: blue;
}
.lyrics {
  font-size: 16px;
}
.column {
  display: inline-block;
}
.row {
  position: relative;
  margin-bottom: 0px;
  font-family: monospace;
  white-space: pre-wrap;
  margin-right: 10px;
  font-size: 23px;
}
p {
	margin: 0;
}
`
export default SongRender