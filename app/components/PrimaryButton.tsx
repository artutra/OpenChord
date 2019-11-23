import React, { FunctionComponent } from "react";
import { TextProps, Text, StyleSheet, TouchableOpacity } from "react-native";
interface PrimaryButtonProps {
  title: string
  onPress: () => void
}
const PrimaryButton: FunctionComponent<PrimaryButtonProps> = (props) => {
  let { title, onPress } = props
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: 'tomato',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white'
  }
})
export default PrimaryButton