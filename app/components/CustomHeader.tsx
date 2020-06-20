import React, { FunctionComponent, ReactNode } from "react";
import { Text, StyleSheet, View } from "react-native";

interface Props {
  title: string
  headerRight?: ReactNode
}
const CustomHeader: FunctionComponent<Props> = ({ title, headerRight }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {headerRight}
  </View>
)
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: .5,
    borderBottomColor: 'rgb(224,224,224)',
    shadowColor: 'rgb(224,224,224)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'sans-serif-medium',
    fontWeight: 'normal',
    fontSize: 20,
    paddingLeft: 16,
    paddingVertical: 14.5,
    color: 'rgb(28, 28, 30)'
  }
})
export default CustomHeader