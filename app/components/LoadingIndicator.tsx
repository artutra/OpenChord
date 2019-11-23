import React, { FunctionComponent } from "react";
import { StyleSheet, StyleProp, ViewStyle, View, ActivityIndicator } from "react-native";
import ErrorText from "./ErrorText";
interface LoadingIndicatorProps {
  style?: StyleProp<ViewStyle>
  error?: string | null
  loading?: boolean
}
const LoadingIndicator: FunctionComponent<LoadingIndicatorProps> = (props) => {
  let { error, loading, style } = props
  return (
    <View style={[styles.container, style]}>
      <ErrorText style={styles.activity}>{error}</ErrorText>
      {loading && <ActivityIndicator style={styles.activity} />}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity: {
    paddingVertical: 20
  }
})
export default LoadingIndicator