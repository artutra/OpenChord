import React, { FunctionComponent } from "react";
import { TextProps, Text, StyleSheet, View, Button } from "react-native";
interface EmptyListMessageProps {
  message: string
  onPress?: () => void
  buttonTitle?: string
}
const EmptyListMessage: FunctionComponent<EmptyListMessageProps> = (props) => {
  let { message, onPress, buttonTitle } = props
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      {buttonTitle && onPress &&
        <Button onPress={onPress} title={buttonTitle} />
      }
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
export default EmptyListMessage