import React, { useState, useEffect, FunctionComponent, useRef, useContext } from "react";
import { StyleSheet, TextInput, Text, Keyboard, StatusBar, Platform, View, Linking } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { Doc } from "../services/BaseService";
import SearchBar from "../components/SearchBar";
import LoadingIndicator from "../components/LoadingIndicator";
import LanguageContext from "../languages/LanguageContext";
import { CompositeNavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, MainTabParamList } from "../AppNavigation";
import EmptyListMessage from "../components/EmptyListMessage";
import CifraboxService from "../services/CifraboxService";

type OnlineSearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'OnlineSearch'>,
  StackNavigationProp<RootStackParamList, 'MainTab'>
>;

type Props = {
  navigation: OnlineSearchScreenNavigationProp;
}

const OnlineSearch: FunctionComponent<Props> = (props) => {
  const searchInput = useRef<TextInput>(null)
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useContext(LanguageContext)

  async function makeSearch() {
    if (query.length > 0) {
      const fetchData = async () => {
        const data = await CifraboxService.getSearch(query)
        let artistDocs: Doc[] = data.artists
        let songDocs: Doc[] = data.songs
        setDocs(artistDocs.concat(songDocs))
      }
      try {
        setIsLoading(true)
        setError(null)
        await fetchData()
        setIsLoading(false)
      } catch (e) {
        if (e instanceof Error) {
          setIsLoading(false)
          setError(e.message)
        } else {
          throw e
        }
      }
    }
  }

  useEffect(() => {
    const showTabBar = () => props.navigation.setOptions({ tabBarVisible: true })
    Keyboard.addListener('keyboardDidHide', showTabBar)
    return () => Keyboard.removeListener('keyboardDidHide', showTabBar)
  }, [])

  useEffect(() => {
    const hideTabBar = () => props.navigation.setOptions({ tabBarVisible: false })
    Keyboard.addListener('keyboardDidShow', hideTabBar)
    return () => Keyboard.removeListener('keyboardDidShow', hideTabBar)
  }, [])

  async function goToSendSongUrl() {
    try {
      await Linking.openURL('https://cifrabox.com/enviar-musica/passo-1')
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <SearchBar
        inputRef={searchInput}
        onSubmitEditing={makeSearch}
        onChangeText={(value) => setQuery(value)}
        query={query}
        placeholder={t('search')}
      />
      <FlatList
        keyExtractor={(item) => item.slug}
        data={docs}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={() => {
          return (docs != null && !isLoading) ?
            <View style={{ flex: 1 }}>
              <Text style={styles.msgInfo}>{t('artist_or_song_not_found')}</Text>
              <EmptyListMessage
                message={t('help_us_and_send')}
                buttonTitle={t('send_song').toUpperCase()}
                onPress={goToSendSongUrl}
              />
            </View>
            : null
        }}
        ListHeaderComponent={<LoadingIndicator error={error} loading={isLoading} />}
        renderItem={({ item }) => {
          if (item.artist_name == null) {
            return (
              <ListItem
                onPress={() => { props.navigation.navigate('OnlineArtistView', { slug: item.slug, title: item.name }) }}
                title={item.name}
              />)
          } else {
            return (
              <ListItem
                onPress={() => { props.navigation.navigate('SongPreview', { slug: item.slug, artist_slug: item.artist_slug }) }}
                title={item.title}
                subtitle={item.artist_name}
              />)
          }
        }}
      />
    </SafeAreaView>
  );
}
export default OnlineSearch

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  msgInfo: {
    marginTop: 10,
    textAlign: 'center',
    color: '#aaa'
  },
  picker: {
    marginHorizontal: 10
  }
});