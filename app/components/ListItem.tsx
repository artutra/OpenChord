import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

interface ListItemProps {
  title: string
  subtitle?: string
  onPress: () => void
}
const ListItem: FunctionComponent<ListItemProps> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      {props.subtitle && <Text style={styles.subtitle}>{props.subtitle}</Text>}
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
  title: {
    fontSize: 18
  },
  subtitle: {
    fontSize: 14
  }
});