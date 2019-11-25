import React from 'react'
import { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import ArtistList from "./containers/ArtistList";
import ArtistView from './containers/ArtistView';
import SongView from './containers/SongView';
import SongList from './containers/SongList';
import TabBarIcon from './components/TabBarIcon';
import OnlineSearch from './containers/OnlineSearch';
import SongPreview from './containers/SongPreview';
import OnlineArtistView from './containers/OnlineArtistView';
import SongEdit from './containers/SongEdit';
import PlaylistList from './containers/PlaylistList';
import PlaylistView from './containers/PlaylistView';
import PlaylistAddSongs from './containers/PlaylistAddSongs';
import PlaylistEdit from './containers/PlaylistEdit';

interface TabBarIconProps {
  focused: boolean
  horizontal: boolean
  tintColor: string
}

export enum ROUTES {
  ArtistList = 'ArtistList',
  ArtistView = 'ArtistView',
  OnlineArtistView = 'OnlineArtistView',
  OnlineSearch = 'OnlineSearch',
  SongEdit = 'SongEdit',
  SongList = 'SongList',
  SongPreview = 'SongPreview',
  SongView = 'SongView',
  PlaylistView = 'PlaylistView',
  PlaylistList = 'PlaylistList',
  PlaylistAddSongs = 'PlaylistAddSongs',
  PlaylistEdit = 'PlaylistEdit'
}

const AppNavigation = createBottomTabNavigator({
  PlaylistList: {
    screen: createStackNavigator({
      PlaylistList: {
        screen: PlaylistList,
        navigationOptions: { title: 'Playlists' }
      },
      PlaylistView,
      SongView,
      SongEdit,
      PlaylistAddSongs: {
        screen: PlaylistAddSongs,
        navigationOptions: { title: 'Add songs' }
      },
      PlaylistEdit
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Playlists',
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="playlist-music" />
    })
  },
  ArtistList: {
    screen: createStackNavigator({
      ArtistList: {
        screen: ArtistList,
        navigationOptions: { title: 'Artists' }
      },
      ArtistView,
      SongView,
      SongEdit,
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
      ArtistView,
      SongView,
      SongEdit,
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Songs',
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="format-list-bulleted-square" />
    })
  },
  OnlineSearch: {
    screen: createStackNavigator({
      OnlineSearch: {
        screen: OnlineSearch,
        navigationOptions: {
          header: null
        }
      },
      SongPreview: {
        screen: SongPreview,
        navigationOptions: {
          title: 'Preview'
        }
      },
      OnlineArtistView,
      SongView
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Online Search',
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="magnify" />
    })
  },
}, {
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
  initialRouteName: ROUTES.SongList
})

export default AppNavigation;
