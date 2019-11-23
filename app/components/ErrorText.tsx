import React, { FunctionComponent } from "react";
import { TextProps, Text, StyleSheet } from "react-native";

const ErrorText: FunctionComponent<TextProps> = (props) => {
  let { style, children } = props
  if (children != null) {
    return <Text {...props} style={[styles.errorMsg, style]}>{children}</Text>
  } else {
    return null
  }
}
const styles = StyleSheet.create({
  errorMsg: { color: 'red' }
})
export default ErrorText