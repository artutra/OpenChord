import React, { useState, useEffect, FunctionComponent, useRef, useContext } from "react";
import { StyleSheet, TextInput, Text, Keyboard, StatusBar, Platform } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { services, getService } from "../services";
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

type OnlineSearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'OnlineSearch'>,
  StackNavigationProp<RootStackParamList, 'MainTab'>
>;

type Props = {
  navigation: OnlineSearchScreenNavigationProp;
}

const OnlineSearch: FunctionComponent<Props> = (props) => {
  const searchInput = useRef<TextInput>(null)
  const [serviceName] = useState(services[0].name)
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useContext(LanguageContext)

  async function makeSearch() {
    if (query.length > 0) {
      const fetchData = async () => {
        const docs = await getService(serviceName)!.getSearch(query)
        setDocs(docs)
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

  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyListMessage
          message={
            t('online_search_not_available') + '. ' +
            t('you_can_still_create_songs_manually')
          }
          buttonTitle={t('create_song').toUpperCase()}
          onPress={() => props.navigation.navigate('SongEdit')}
        />
      </SafeAreaView>
    )
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
        keyExtractor={(item) => item.path}
        data={docs}
        ListEmptyComponent={() => {
          return (docs != null && !isLoading) ?
            <Text style={styles.msgInfo}>{t('artist_or_song_not_found')}</Text> :
            null
        }}
        ListHeaderComponent={<LoadingIndicator error={error} loading={isLoading} />}
        renderItem={({ item, index }) => {
          if (item.type == 'artist') {
            return (
              <ListItem
                onPress={() => { props.navigation.navigate('OnlineArtistView', { path: item.path, serviceName, title: item.name }) }}
                title={item.name}
              />)
          } else {
            return (
              <ListItem
                onPress={() => { props.navigation.navigate('SongPreview', { path: item.path, serviceName }) }}
                title={item.title}
                subtitle={item.artist}
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
    flex: 1
  },
  msgInfo: {
    textAlign: 'center',
    color: '#aaa'
  },
  picker: {
    marginHorizontal: 10
  }
});