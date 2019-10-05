import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchBarProps {
  query: string
  onChangeText: (text: string) => void
  onSubmitEditing: () => void
}
const SearchBar: FunctionComponent<SearchBarProps> = (props) => {
  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 100, paddingHorizontal: 10 }}>
        <Icon name="magnify" size={20} color="#aaa" />
        <TextInput
          style={{ flex: 1, padding: 5, fontSize: 14 }}
          keyboardType="default"
          placeholder="Search"
          placeholderTextColor="#565e84"
          autoFocus={false}
          autoCorrect={false}
          autoCapitalize='none'
          onSubmitEditing={props.onSubmitEditing}
          onChangeText={props.onChangeText}
          value={props.query}
        />
      </View>
    </View>
  );
}
export default SearchBar

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