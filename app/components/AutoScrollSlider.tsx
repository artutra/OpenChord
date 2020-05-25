import React, { useState, useEffect, FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import TouchableIcon from "./TouchableIcon";
import Slider from '@react-native-community/slider';

interface AutoScrollSliderProps {
  show: boolean
  onClose: () => void
  onValueChange: (value: number) => void
}
const AutoScrollSlider: FunctionComponent<AutoScrollSliderProps> = (props) => {
  let { show, onClose, onValueChange } = props
  const [isActive, setIsActive] = useState(false)
  const [sliderValue, setSliderValue] = useState(0.5)

  function onSliderValueChange(value: number) {
    setSliderValue(value)
    if (isActive) {
      onValueChange(sliderValue)
    }
  }

  function play() {
    setIsActive(true)
    onValueChange(sliderValue)
  }

  function stop() {
    setIsActive(false)
    onValueChange(0)
  }

  useEffect(() => {
    if (show) {
      setIsActive(true)
    }
  }, [show])

  useEffect(() => {
    if (isActive) {
      onSliderValueChange(sliderValue)
    }
  }, [isActive])

  if (!show) {
    return null
  } else {
    return (
      <View style={styles.container}>
        {
          isActive ?
            <TouchableIcon name="pause" onPress={stop} /> :
            <TouchableIcon name="play" onPress={play} />
        }
        <Slider
          style={{ flex: 1 }}
          value={sliderValue}
          onValueChange={onSliderValueChange}
          onSlidingStart={onSliderValueChange}
          onSlidingComplete={onSliderValueChange}
          minimumValue={0}
          maximumValue={1}
        />
        <TouchableIcon name="close" onPress={onClose} />
      </View>
    )
  }
}
export default AutoScrollSlider

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ccc'
  }
});