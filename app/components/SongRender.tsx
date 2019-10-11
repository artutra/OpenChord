import React, { FunctionComponent } from 'react'
import WebView from 'react-native-webview'

interface Props {
  chordProContent: string
  onPressChord?: (chord: string) => void
}
const SongRender: FunctionComponent<Props> = (props) => {
  return (
    <WebView
      startInLoadingState={true}
      overScrollMode={'never'}
      source={{ html: renderHtml(props.chordProContent, styles) }}
      injectedJavaScript={onClickChordPostMessage}
      onMessage={(event) => { if (props.onPressChord) props.onPressChord(event.nativeEvent.data) }}
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
body {
  font-family: monospace;
}
.title {
  font-size: 20px
}
.artist {
  font-weight: bold;
  color: red;
}
.chord:hover {
  color: blue;
}
.line {
  margin: 0;
  position: relative;
  margin-bottom: 0px;
  font-size: 14px;
  font-family: monospace;
  white-space: pre-wrap;
  margin-right: 10px;
}
.chord {
  color: red;
  position: relative;
  display: inline-block;
  line-height: 20px;
  padding-top: 20px;
  padding-top: 15px;
  width: 0px;
  top: -17px;
  cursor: pointer;
}
.chord:active {
  color: blue;
}
.word {
  display: inline-block;
}
`
export default SongRender