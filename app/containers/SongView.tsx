import React, { useState } from "react";
import { Text } from "react-native";
import realm, { Song } from '../db'
import { NavigationScreenProp } from "react-navigation";
import ChordSheetJS from 'chordsheetjs'
import WebView from 'react-native-webview'

interface Props {
  navigation: NavigationScreenProp<any, { id: string, title: string }>
}
const SongView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let song = realm.objectForPrimaryKey<Song>('Song', id)!
  const parser = new ChordSheetJS.ChordProParser();
  const formatter = new ChordSheetJS.HtmlDivFormatter();
  const parsedSong = parser.parse(song.content);
  const [content] = useState(formatter.format(parsedSong))
  const headers = `<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">`
  function renderHtml(headers: string, body: string, styles: string) {
    return `<html>
      <head>${headers}</head>
      <body>${body}</body>
      <style>${styles}</style>
    </html>`
  }

  function onClickChord(chord: string) {
    // TODO: Show guitar chord diagram
  }

  return (
    <WebView
      startInLoadingState={true}
      overScrollMode={'never'}
      scrollEnabled={false}
      source={{ html: renderHtml(headers, content, styles) }}
      injectedJavaScript={onClickChordPostMessage}
      onMessage={(event) => { onClickChord(event.nativeEvent.data) }}
    />
  );
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
SongView.navigationOptions = (props: Props) => ({
  title: props.navigation.getParam('title')
});
export default SongView