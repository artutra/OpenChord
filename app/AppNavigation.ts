import { createBottomTabNavigator } from 'react-navigation-tabs'
import ArtistList from "./containers/ArtistList";
import Config from "./containers/Config";
import PlaylistList from "./containers/PlaylistList";
import Search from "./containers/Search";

const AppNavigation = createBottomTabNavigator({
  ArtistList,
  PlaylistList,
  Search,
  Config,
});


export default AppNavigation;