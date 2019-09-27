import React from 'react'
import { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import ArtistList from "./containers/ArtistList";
import Config from "./containers/Config";
import PlaylistList from "./containers/PlaylistList";
import Search from "./containers/Search";
import ArtistView from './containers/ArtistView';
import SongView from './containers/SongView';
import PlaylistView from './containers/PlaylistView';
import SongList from './containers/SongList';
import { BottomTabBarOptions } from 'react-navigation-tabs/lib/typescript/src/types';
import TabBarIcon from './components/TabBarIcon';

interface TabBarIconProps {
  focused: boolean
  horizontal: boolean
  tintColor: string
}

interface TabNavigatorConfig {
  tabBarOptions: BottomTabBarOptions
}

let tabNavigatorConfig: TabNavigatorConfig = {
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  }
}

const AppNavigation = createBottomTabNavigator({
  ArtistList: {
    screen: createStackNavigator({
      ArtistList: {
        screen: ArtistList,
        navigationOptions: { title: 'Artists' }
      },
      ArtistView,
      SongView
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Artists',
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="artist" />
    })
  },
  SongList: {
    screen: createStackNavigator({
      SongList: {
        screen: SongList,
        navigationOptions: { title: 'Songs' }
      },
      SongView
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Songs',
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="playlist-music" />
    })
  },
  //PlaylistList: createStackNavigator({
  //  PlaylistList,
  //  PlaylistView,
  //  SongView
  //}),
  //Search,
  Config: {
    screen: Config,
    navigationOptions: {
      title: 'Settings',
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="settings" />
    }
  },
}, tabNavigatorConfig)

export default AppNavigation;