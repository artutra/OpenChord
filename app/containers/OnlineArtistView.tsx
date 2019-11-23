import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationScreenProp, NavigationScreenComponent } from "react-navigation"
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { NavigationStackProp, NavigationStackOptions } from "react-navigation-stack/lib/typescript/types";
import { getService } from "../services";
import { SongDoc } from "../services/BaseService";
import ErrorText from "../components/ErrorText";
import LoadingIndicator from "../components/LoadingIndicator";

interface Props {
  navigation: NavigationStackProp<{}, { path: string, serviceName: string, title: string }>
}
const OnlineArtistView: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props: Props) => {
  const [songs, setSongs] = useState<SongDoc[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  let serviceName = props.navigation.getParam('serviceName')
  let path = props.navigation.getParam('path')

  useEffect(() => {
    const fetchData = async () => {
      try {
        let docs = await getService(serviceName)!.getArtistSongs(path)
        setSongs(docs)
        setIsLoading(false)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
          setIsLoading(false)
        } else {
          throw e
        }
      }
    }
    fetchData()
  }, []);

  function onSelectSong(path: string, serviceName: string) {
    props.navigation.navigate('SongPreview', { path, serviceName })
  }

  return (
    <FlatList
      keyExtractor={(item) => item.path}
      data={songs}
      ListHeaderComponent={<LoadingIndicator error={error} loading={isLoading} />}
      renderItem={({ item }) => {
        return <ListItem title={item.title} onPress={() => onSelectSong(item.path, serviceName)} />
      }}
    />
  );
}
OnlineArtistView.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title')
});

export default OnlineArtistView