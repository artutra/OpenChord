import React, { useState, useEffect, FunctionComponent } from "react";
import { View, StyleSheet, Picker, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { NavigationStackProp, NavigationStackOptions } from "react-navigation-stack/lib/typescript/types";
import { NavigationScreenComponent } from "react-navigation";
import { services, getService } from "../services";
import { Doc } from "../services/BaseService";

interface OnlineSearchProps {
  title: string
  subtitle?: string
  onPress: () => void
  navigation: NavigationStackProp<{}, {}>
}

const OnlineSearch: FunctionComponent<OnlineSearchProps> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const [baseServices] = useState(services)
  const [serviceName, setServiceName] = useState(services[0].name)
  const [docs, setDocs] = useState<Doc[]>([])
  const [query, setQuery] = useState('')

  async function makeSearch() {
    if (query.length > 2) {
      const fetchData = async () => {
        const docs = await getService(serviceName)!.getSearch(query)
        setDocs(docs)
      };
      fetchData();
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Picker
        selectedValue={serviceName}
        style={{}}
        onValueChange={(itemValue, itemIndex) =>
          setServiceName(itemValue)
        }>
        {baseServices.map(service => {
          return <Picker.Item key={service.name} label={service.name} value={service.name} />
        })}
      </Picker>
      <TextInput
        style={{}}
        keyboardType="default"
        placeholder="Search"
        placeholderTextColor="#565e84"
        autoFocus={false}
        autoCorrect={false}
        autoCapitalize='none'
        onSubmitEditing={makeSearch}
        onChangeText={(value) => setQuery(value)}
        value={query}
      />
      <FlatList
        data={docs}
        renderItem={({ item, index }) => {
          if (item.type == 'artist') {
            return (
              <ListItem
                key={item.name}
                onPress={() => { props.navigation.navigate('OnlineArtistView', { path: item.path, serviceName }) }}
                title={item.name}
              />)
          } else {
            return (
              <ListItem
                key={item.title + item.artist}
                onPress={() => { props.navigation.navigate('SongPreview', { path: item.path, serviceName }) }}
                title={item.title}
                subtitle={item.artist}
              />)
          }
        }}
      />
    </View>
  );
}
export default OnlineSearch

const styles = StyleSheet.create({
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