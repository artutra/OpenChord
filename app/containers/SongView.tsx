import React, { useState, useEffect, FunctionComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Song } from '../db'
import { NavigationScreenComponent } from "react-navigation";
import SideMenu from 'react-native-side-menu'
import SongRender from "../components/SongRender";
import TouchableIcon from "../components/TouchableIcon";
import { NavigationStackOptions, NavigationStackProp, } from "react-navigation-stack/lib/typescript/types";

type Params = { id: string, title: string, openSideMenu: () => void }

type Props = {
  navigation: NavigationStackProp<{}, Params>
}

const SongView: FunctionComponent<Props> & NavigationScreenComponent<
  NavigationStackOptions,
  NavigationStackProp
> = (props) => {
  const [content, setContent] = useState<string>("")
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const [tone, setTone] = useState<number>(0)

  function transposeUp() { setTone(tone + 1 >= 12 ? 0 : tone + 1) }
  function transposeDown() { setTone(tone - 1 <= -12 ? 0 : tone - 1) }
  function openSideMenu() { setIsSideMenuOpen(!isSideMenuOpen) }

  function onClickChord(chord: string) {
    // TODO: Show guitar chord diagram
  }

  useEffect(() => {
    let id = props.navigation.getParam('id')
    let song = Song.getById(id)!
    setContent(song.content)
  }, [content])

  useEffect(() => {
    props.navigation.setParams({ 'openSideMenu': openSideMenu })
  }, [isSideMenuOpen])

  return (
    <SideMenu
      menu={
        <View style={styles.sideMenuContainer}>
          <View style={styles.toolbarContainer}>
            <TouchableIcon onPress={transposeUp} name="plus" />
            <Text>{tone}</Text>
            <TouchableIcon onPress={transposeDown} name="minus" />
          </View>
        </View>
      }
      onChange={(isOpen) => { setIsSideMenuOpen(isOpen) }}
      openMenuOffset={50}
      isOpen={isSideMenuOpen}
      menuPosition="right"
      disableGestures={true}
    >
      <SongRender
        onPressChord={onClickChord}
        chordProContent={content}
        tone={tone}
      />
    </SideMenu>
  );
}

SongView.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('title'),
    headerRight: <TouchableIcon onPress={navigation.getParam('openSideMenu')} name="settings" />,
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    backgroundColor: '#eee',
    flex: 1
  },
  toolbarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc'
  }
})
export default SongView