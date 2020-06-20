import React, { FunctionComponent, ReactNode } from "react";
import { Text, StyleSheet, View, Platform } from "react-native";

interface Props {
  title: string
  headerRight?: ReactNode
}
const CustomHeader: FunctionComponent<Props> = ({ title, headerRight }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.headerRight}>
      {headerRight}
    </View>
  </View>
)
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'white',
    borderBottomWidth: .5,
    borderBottomColor: 'rgb(224,224,224)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgb(224, 224, 224)',
    paddingLeft: Platform.OS === 'android' ? 16 : undefined,
  },
  title: {
    flex: 1,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
    fontWeight: Platform.OS === 'android' ? 'normal' : '600',
    fontSize: Platform.OS === 'android' ? 20 : 17,
    textAlign: Platform.OS === 'ios' ? 'center' : undefined,
    paddingVertical: 14.5,
    color: 'rgb(28, 28, 30)'
  },
  headerRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,

  }
})
export default CustomHeader