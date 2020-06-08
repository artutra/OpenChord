import React, { useState, useEffect, useContext } from "react";
import { NavigationScreenProp } from "react-navigation"
import Slider from "@react-native-community/slider";
import { View, Text } from "react-native";
import SongTransformer from "../../components/SongTransformer";
import SongRender from "../../components/SongRender";
import { GlobalSettings } from "../../db/GlobalSettings";

interface Props {
  navigation: NavigationScreenProp<any, any>
}
const FontSizeSelect = (props: Props) => {
  const [fontSize, setFontSize] = useState(GlobalSettings.get().fontSize)

  let chordSheet = "" +
    "This[C] is an example[D] song\n" +
    "Lor[F#m]em ipsum dolor sit ame[G]t\n" +
    "C[C]onsectetur adipiscing elit[D]\n" +
    "Sed do eiusm[F#m]od tempor incididunt u[C]t\n" +
    "labore et dolore magna aliqua\n"

  function onChange(value: number) {
    GlobalSettings.setFontSize(value)
    setFontSize(value)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingBottom: 24, paddingTop: 24, paddingHorizontal: 20, flexDirection: 'row', borderBottomColor: '#00000020', borderBottomWidth: 1, marginBottom: 10 }}>
        <Slider style={{ flex: 1 }} value={fontSize} step={2} onValueChange={onChange} maximumValue={24} minimumValue={14} />
        <Text style={{ marginLeft: 10 }}>{fontSize}</Text>
      </View>
      <SongTransformer
        fontSize={fontSize}
        transposeDelta={0}
        chordProSong={chordSheet}
      >
        {({ chords, htmlSong }) => (
          <View style={{ flex: 1 }}>
            <SongRender
              chordProContent={htmlSong}
            />
          </View>
        )}
      </SongTransformer>
    </View>
  )
}
export default FontSizeSelect