import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  title: string
  subtitle?: string
  onPress: () => void
}
const ListItem = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.item}>
      <Text style={styles.itemTitle}>{props.title}</Text>
    </TouchableOpacity>
  );
}
export default ListItem

const styles = StyleSheet.create({
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  itemTitle: {
    fontSize: 18
  }
});