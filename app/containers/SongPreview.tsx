import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationScreenComponent } from "react-navigation";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import SongRender from "../components/SongRender";
import SongTransformer from "../components/SongTransformer";
import { getService } from "../services";

interface SongPreviewProps {
  navigation: NavigationStackProp<{}, { path: string, serviceName: string }>
}
const SongPreview: FunctionComponent<SongPreviewProps> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const [html, setHtml] = useState('')
  const [chordSheet, setChordCheet] = useState<string | null>(null)
  let serviceName = props.navigation.getParam('serviceName')
  let path = props.navigation.getParam('path')

  useEffect(() => {
    const fetchData = async () => {
      let service = getService(serviceName)!
      let html = await service.getSongHtml(path)
      let chordPro = service.parseToChordPro(html)
      setChordCheet(chordPro)
    };
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {chordSheet == null ? <Text>Loading...</Text> :

        <SongTransformer
          transposeDelta={0}
          chordProSong={chordSheet}
        >
          {({ chords, htmlSong }) => (
            <SongRender
              chordProContent={htmlSong}
            // height={700}
            />
          )}
        </SongTransformer>
      }

    </View>
  );
}
export default SongPreview

const styles = StyleSheet.create({
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  itemTitle: {
    fontSize: 18
  }
});