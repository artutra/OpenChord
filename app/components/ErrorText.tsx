import React, { FunctionComponent } from "react";
import { TextProps, Text, StyleSheet } from "react-native";

const ErrorText: FunctionComponent<TextProps> = (props) => {
  if (props.children != null) {
    return <Text style={[styles.errorMsg, props.style]} {...props}>{props.children}</Text>
  } else {
    return null
  }
}
const styles = StyleSheet.create({
  errorMsg: { color: 'red' }
})
export default ErrorText