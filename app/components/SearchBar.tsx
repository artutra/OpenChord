import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchBarProps extends TextInputProps {
  query: string
  inputRef?: React.RefObject<TextInput> | null | undefined
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
  placeholder: string
}
const SearchBar: FunctionComponent<SearchBarProps> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="magnify" size={24} color="#aaa" />
        <TextInput
          ref={props.inputRef}
          style={styles.searchText}
          keyboardType="default"
          placeholderTextColor="#aaa"
          autoFocus={false}
          autoCorrect={false}
          autoCapitalize='none'
          onSubmitEditing={props.onSubmitEditing}
          value={props.query}
          {...props}
        />
      </View>
    </View>
  );
}
export default SearchBar

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
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
    paddingVertical: 8,
    paddingLeft: 8,
    fontSize: 18
  }
});