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
.line-size-14 { font-size: 14px; }
.line-size-15 { font-size: 15px; }
.line-size-16 { font-size: 16px; }
.line-size-17 { font-size: 17px; }
.line-size-18 { font-size: 18px; }
.line-size-19 { font-size: 19px; }
.line-size-20 { font-size: 20px; }
.line-size-21 { font-size: 21px; }
.line-size-22 { font-size: 22px; }
.line-size-23 { font-size: 23px; }
.line-size-24 { font-size: 24px; }
.chord {
  color: red;
  position: relative;
  display: inline-block;
  padding-top: 20px;
  width: 0px;
  top: -17px;
  cursor: pointer;
}
.chord-size-14 { top: -14px; }
.chord-size-15 { top: -15px; }
.chord-size-16 { top: -16px; }
.chord-size-17 { top: -17px; }
.chord-size-18 { top: -18px; }
.chord-size-19 { top: -19px; }
.chord-size-20 { top: -20px; }
.chord-size-21 { top: -21px; }
.chord-size-22 { top: -22px; }
.chord-size-23 { top: -23px; }
.chord-size-24 { top: -24px; }
.chord:active {
  color: blue;
}
.word {
  display: inline-block;
}
`
export default SongRender