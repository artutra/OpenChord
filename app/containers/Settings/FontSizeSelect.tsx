import React, { useState, FC } from "react";
import Slider from "@react-native-community/slider";
import { View, Text, StyleSheet } from "react-native";
import SongTransformer from "../../components/SongTransformer";
import SongRender from "../../components/SongRender";
import { GlobalSettings } from "../../db/GlobalSettings";

export const MIN_FONT_SIZE = 14
export const MAX_FONT_SIZE = 24
export const FONT_SIZE_STEP = 2
const FontSizeSelect: FC = () => {
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
    <View style={[styles.f1, styles.bgWhite]}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.f1}
          value={fontSize}
          step={FONT_SIZE_STEP}
          minimumValue={MIN_FONT_SIZE}
          maximumValue={MAX_FONT_SIZE}
          onValueChange={onChange}
        />
        <Text style={styles.sliderLabel}>{fontSize}</Text>
      </View>
      <SongTransformer
        fontSize={fontSize}
        transposeDelta={0}
        chordProSong={chordSheet}
      >
        {({ chords, htmlSong }) => (
          <View style={styles.f1}>
            <SongRender
              chordProContent={htmlSong}
            />
          </View>
        )}
      </SongTransformer>
    </View>
  )
}
const styles = StyleSheet.create({
  bgWhite: {
    backgroundColor: 'white'
  },
  sliderContainer: {
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderBottomColor: '#00000020',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  sliderLabel: {
    marginLeft: 10
  },
  f1: {
    flex: 1
  }
});
export default FontSizeSelect