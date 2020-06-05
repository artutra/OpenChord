import React, { useEffect, useRef, FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet, FlatList, StyleProp, ViewStyle } from "react-native";
import ChordChart from "../components/ChordChart";
import chords from '../assets/chords/guitar.json'

interface Props {
  selectedChord: Chord | null | undefined
  allChords: Array<Chord>
  onPressClose: () => void
  closeLabel: string
}
const ChordTab: FunctionComponent<Props> = ({ selectedChord, allChords, onPressClose, closeLabel }) => {
  const flatList = useRef<FlatList<Chord>>(null)

  if (selectedChord != null && flatList.current != null)
    flatList.current.scrollToItem({ animated: true, item: selectedChord })

  if (selectedChord == null)
    return null

  return (
    <View style={styles.tabContainter}>
      <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
        <Text style={styles.closeButtonText}>{closeLabel}</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatList}
        style={styles.chordList}
        onScrollToIndexFailed={() => { }}
        keyExtractor={(item, index) => item.toString()}
        horizontal
        data={allChords}
        extraData={selectedChord}
        renderItem={({ item }) => {
          let allChords: any = chords
          let position = null
          if (allChords.hasOwnProperty(item.toString())) {
            let chordObj = allChords[item.toString()].find(() => true)
            if (chordObj != null) {
              position = chordObj.positions
            }
          }
          let selectedStyle: StyleProp<ViewStyle> = null
          if (item.toString() == selectedChord.toString())
            selectedStyle = styles.itemSelected
          return (
            <View key={item.toString()} style={[styles.item, selectedStyle]}>
              <ChordChart
                width={100}
                height={120}
                chord={position}
              />
              <Text>{item.toString()}</Text>
            </View>
          )
        }}
      />
    </View>

  );
}
export default ChordTab

const styles = StyleSheet.create({
  tabContainter: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 180,
    zIndex: 999
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
    fontSize: 14
  },
  closeButtonText: {
    fontSize: 16
  },
  chordList: {
    backgroundColor: '#eee'
  },
  item: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemTitle: {
    fontSize: 18
  },
  itemSelected: {
    borderBottomColor: 'tomato',
    borderBottomWidth: 5
  }
});