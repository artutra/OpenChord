import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { NavigationStackProp } from "react-navigation-stack/lib/typescript/types";
import { getService } from "../services";
import { SongDoc } from "../services/BaseService";

interface Props {
  navigation: NavigationStackProp<{}, { path: string, serviceName: string }>
}
const OnlineArtistView = (props: Props) => {
  const [songs, setSongs] = useState<SongDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  let serviceName = props.navigation.getParam('serviceName')
  let path = props.navigation.getParam('path')

  useEffect(() => {
    const fetchData = async () => {
      let docs = await getService(serviceName)!.getArtistSongs(path)
      setSongs(docs)
      setIsLoading(false)
    };
    fetchData();
  }, []);

  function onSelectSong(path: string, serviceName: string) {
    props.navigation.navigate('SongView', { path, serviceName })
  }

  return (
    <View>
      {isLoading && <Text>Is loading...</Text>}
      <FlatList
        data={songs}
        renderItem={({ item }) => {
          return <ListItem title={item.title} onPress={() => onSelectSong(item.path, serviceName)} />
        }}
      />
    </View>
  );
}

export default OnlineArtistView