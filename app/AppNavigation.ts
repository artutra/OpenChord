import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import ArtistList from "./containers/ArtistList";
import Config from "./containers/Config";
import PlaylistList from "./containers/PlaylistList";
import Search from "./containers/Search";
import ArtistView from './containers/ArtistView';
import SongView from './containers/SongVIew';
import PlaylistView from './containers/PlaylistView';

const AppNavigation = createBottomTabNavigator({
  ArtistList: createStackNavigator({
    ArtistList,
    ArtistView,
    SongView
  }),
  PlaylistList: createStackNavigator({
    PlaylistList,
    PlaylistView,
    SongView
  }),
  Search,
  Config,
});


export default AppNavigation;