import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import TouchableIcon from "./TouchableIcon";
import OptionsMenu, { Option } from "./OptionsMenu";

interface ListItemProps {
  title: string
  subtitle?: string
  onPress: () => void
  options?: Option[]
}
const ListItem: FunctionComponent<ListItemProps> = (props) => {
  const [isMenuEnabled, setMenuEnabled] = useState(false)
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.title}</Text>
        {props.subtitle && <Text style={styles.subtitle}>{props.subtitle}</Text>}
      </View>
      {props.options &&
        <TouchableIcon onPress={() => setMenuEnabled(true)} name="dots-vertical" size={25} />
      }
      {props.options &&
        <OptionsMenu
          onDismiss={() => setMenuEnabled(false)}
          enabled={isMenuEnabled}
          options={props.options} />
      }
    </TouchableOpacity>
  );
}
export default ListItem

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  textContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18
  },
  subtitle: {
    fontSize: 14
  }
});