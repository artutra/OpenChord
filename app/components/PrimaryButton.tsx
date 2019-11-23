import React, { FunctionComponent } from "react";
import { Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

interface PrimaryButtonProps {
  style?: StyleProp<ViewStyle>
  title: string
  onPress: () => void
  outline?: boolean
}
const PrimaryButton: FunctionComponent<PrimaryButtonProps> = (props) => {
  let { title, onPress, outline = false, style } = props
  return (
    <TouchableOpacity style={[outline ? styles.buttonOutline : styles.button, style]} onPress={onPress}>
      <Text style={outline ? styles.titleOutline : styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  buttonOutline: {
    borderColor: 'tomato',
    padding: 10,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'tomato',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleOutline: {
    color: 'tomato'
  },
  title: {
    color: 'white'
  }
})
export default PrimaryButton