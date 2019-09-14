import React, { useState } from "react";
import { Text } from "react-native";
import realm, { Song } from '../db'
import { NavigationScreenProp } from "react-navigation";
import ChordSheetJS from 'chordsheetjs'

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const SongView = (props: Props) => {
  let id = props.navigation.getParam('id')
  let song = realm.objectForPrimaryKey<Song>('Song', id)!
  const parser = new ChordSheetJS.ChordProParser();
  const formatter = new ChordSheetJS.TextFormatter();
  const parsedSong = parser.parse(song.content);
  const [content] = useState(formatter.format(parsedSong))
  return (
    <Text>{content}</Text>
  );
}
export default SongView