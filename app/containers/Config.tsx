import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import realm, { Artist, Song } from '../db'

const Config = () => {
  function deleteAllSongs() {
    realm.write(() => {
      realm.delete(realm.objects('Song'))
      realm.delete(realm.objects('Artist'))
    })
  }
  function seedSongDb() {
    Song.populateDb()
  }
  return (
    <View style={styles.container}>
      {__DEV__ && (
        <TouchableOpacity onPress={deleteAllSongs} style={styles.item}>
          <Text style={styles.itemTitle}> Apagar músicas </Text>
        </TouchableOpacity>
      )}
      {__DEV__ && (
        <TouchableOpacity onPress={seedSongDb} style={styles.item}>
          <Text style={styles.itemTitle}> Popular músicas </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
export default Config
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
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