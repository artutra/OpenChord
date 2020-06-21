import React, { FunctionComponent } from "react";
import { TextProps, Text, StyleSheet, View, Button } from "react-native";
import PrimaryButton from "./PrimaryButton";
interface EmptyListMessageProps {
  message: string
  onPress?: () => void
  buttonTitle?: string
}
const EmptyListMessage: FunctionComponent<EmptyListMessageProps> = (props) => {
  let { message, onPress, buttonTitle } = props
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {buttonTitle && onPress &&
        <PrimaryButton onPress={onPress} title={buttonTitle} />
      }
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  }
})
export default EmptyListMessage