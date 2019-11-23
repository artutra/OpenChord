import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchBarProps {
  query: string
  inputRef?: React.RefObject<TextInput> | null | undefined
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
}
const SearchBar: FunctionComponent<SearchBarProps> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="magnify" size={20} color="#aaa" />
        <TextInput
          ref={props.inputRef}
          style={styles.searchText}
          keyboardType="default"
          placeholder="Search"
          placeholderTextColor="#aaa"
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
  container: {
    padding: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 100,
    paddingHorizontal: 10
  },
  searchText: {
    flex: 1,
    padding: 5,
    fontSize: 14
  }
});