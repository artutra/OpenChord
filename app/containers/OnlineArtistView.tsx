import React, { useState, useEffect, FunctionComponent } from "react";
import { FlatList } from "react-native";
import ListItem from "../components/ListItem";
import LoadingIndicator from "../components/LoadingIndicator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../AppNavigation";
import { RouteProp } from "@react-navigation/native";
import CifraboxService from "../services/CifraboxService";

type OnlineArtistViewScreenRouteProp = RouteProp<RootStackParamList, 'OnlineArtistView'>
type OnlineArtistViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OnlineArtistView'
>
type Props = {
  route: OnlineArtistViewScreenRouteProp
  navigation: OnlineArtistViewScreenNavigationProp
}
const OnlineArtistView: FunctionComponent<Props> = (props: Props) => {
  const [songs, setSongs] = useState<{ id: number, title: string, slug: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  let slug = props.route.params.slug

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await CifraboxService.getArtistSongs(slug)
        setSongs(data.songs)
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

  function onSelectSong(slug: string, artist_slug: string) {
    props.navigation.navigate('SongPreview', { slug, artist_slug })
  }

  return (
    <FlatList
      keyExtractor={(item) => item.slug}
      data={songs}
      ListHeaderComponent={<LoadingIndicator error={error} loading={isLoading} />}
      renderItem={({ item }) => {
        return <ListItem title={item.title} onPress={() => onSelectSong(item.slug, slug)} />
      }}
    />
  );
}

export default OnlineArtistView