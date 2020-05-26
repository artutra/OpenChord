import React, { useState, useEffect, FunctionComponent, useRef } from "react";
import { View, StyleSheet, Picker, TextInput, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { NavigationStackProp, NavigationStackOptions } from "react-navigation-stack/lib/typescript/types";
import { NavigationScreenComponent, withNavigationFocus } from "react-navigation";
import { services, getService } from "../services";
import { Doc } from "../services/BaseService";
import { Header } from "react-navigation-stack";
import SearchBar from "../components/SearchBar";
import SafeAreaView from "react-native-safe-area-view";
import LoadingIndicator from "../components/LoadingIndicator";

interface OnlineSearchProps {
  navigation: NavigationStackProp<{}, {}>
  isFocused: boolean // Provided by the withNavigationFocus HOC
}

const OnlineSearch: FunctionComponent<OnlineSearchProps> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const searchInput = useRef<TextInput>(null)
  const [baseServices] = useState(services)
  const [serviceName, setServiceName] = useState(services[0].name)
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    if (searchInput.current && props.isFocused) {
      searchInput.current.focus()
    }
  }, [props.isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <Picker
          selectedValue={serviceName}
          style={styles.picker}
          onValueChange={(value) => setServiceName(value)}>
          {baseServices.map(service => {
            return <Picker.Item key={service.name} label={service.name} value={service.name} />
          })}
        </Picker>
      </View>
      <SearchBar
        inputRef={searchInput}
        onSubmitEditing={makeSearch}
        onChangeText={(value) => setQuery(value)}
        query={query}
      />
      <FlatList
        keyExtractor={(item) => item.path}
        data={docs}
        ListEmptyComponent={() => {
          return (docs != null && !isLoading) ?
            <Text style={styles.msgInfo}>Artist or song not found</Text> :
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
export default withNavigationFocus(OnlineSearch)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  msgInfo: {
    textAlign: 'center',
    color: '#aaa'
  },
  customHeader: {
    height: Header.HEIGHT,
    backgroundColor: 'white',
    elevation: 4,
    justifyContent: 'center'
  },
  picker: {
    marginHorizontal: 10
  }
});