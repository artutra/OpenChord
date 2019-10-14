import React, { useState, useEffect, FunctionComponent } from "react";
import { NavigationScreenProp, NavigationScreenComponent } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import realm, { Song } from '../db'
import ListItem from "../components/ListItem";
import TouchableIcon from "../components/TouchableIcon";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack/lib/typescript/types";

interface Props {
  navigation: NavigationScreenProp<any, { addSong: () => void }>
}
const SongList: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props: Props) => {
  const [songs] = useState(realm.objects<Song>('Song').sorted('title'));
  function onSelectSong(id: string, title: string) {
    props.navigation.navigate('SongView', { id, title })
  }
  function addNewSong() {
    props.navigation.navigate('SongEdit')
  }

  useEffect(() => {
    props.navigation.setParams({ 'addSong': addNewSong })
  }, [songs])

  return (
    <FlatList
      data={songs}
      renderItem={({ item }) => {
        return <ListItem key={item.id!} title={item.title} onPress={() => onSelectSong(item.id!, item.title)} />
      }}
    />
  );
}
SongList.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <TouchableIcon onPress={navigation.getParam('addSong')} name="plus" />,
  }
}

export default SongList