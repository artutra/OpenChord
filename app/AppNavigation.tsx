import React, { useContext } from 'react'
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
import Settings from './containers/Settings';
import FontSizeSelect from './containers/Settings/FontSizeSelect';
import StackHeaderTitle from './navigation/StackHeaderTitle';
import TabBarLabel from './navigation/TabBarLabel';

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
  PlaylistEdit = 'PlaylistEdit',
  Settings = 'Settings',
  FontSizeSelect = 'FontSizeSelect'
}

const AppNavigation = createBottomTabNavigator({
  PlaylistList: {
    screen: createStackNavigator({
      PlaylistList: {
        screen: PlaylistList,
        navigationOptions: { headerTitle: <StackHeaderTitle text="playlists" /> }
      },
      PlaylistView,
      SongView,
      SongEdit,
      PlaylistAddSongs: {
        screen: PlaylistAddSongs,
        navigationOptions: { headerTitle: <StackHeaderTitle text="add_songs" /> }
      },
      PlaylistEdit
    }),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: <TabBarLabel text="playlists" />,
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="playlist-music" />
    })
  },
  ArtistList: {
    screen: createStackNavigator({
      ArtistList: {
        screen: ArtistList,
        navigationOptions: {
          headerTitle: <StackHeaderTitle text="artists" />
        }
      },
      ArtistView,
      SongView,
      SongEdit,
    }),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: <TabBarLabel text="artists" />,
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="artist" />
    })
  },
  SongList: {
    screen: createStackNavigator({
      SongList: {
        screen: SongList,
        navigationOptions: {
          headerTitle: <StackHeaderTitle text="songs" />
        }
      },
      ArtistView,
      SongView,
      SongEdit,
    }),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: <TabBarLabel text="songs" />,
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
          headerTitle: <StackHeaderTitle text="preview" />
        }
      },
      OnlineArtistView,
      SongView
    }),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: <TabBarLabel text="online_search" />,
      tabBarVisible: navigation.state.index <= 0,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="magnify" />
    })
  },
  Settings: {
    screen: createStackNavigator({
      Settings: {
        screen: Settings,
        navigationOptions: { header: null }
      },
      FontSizeSelect: {
        screen: FontSizeSelect,
        navigationOptions: {
          headerTitle: <StackHeaderTitle text="text_size" />
        }
      }
    }),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: <TabBarLabel text="settings" />,
      tabBarIcon: (props: TabBarIconProps) => <TabBarIcon {...props} name="settings" />
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
