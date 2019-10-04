import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props {
  focused: boolean
  horizontal: boolean
  tintColor: string
  name: string
}

const TabBarIcon = (props: Props) => {
  let nameUnfocused = props.name
  if (MaterialCommunityIcons.hasIcon(nameUnfocused + '-outline')) {
    nameUnfocused = props.name + '-outline'
  }
  return <MaterialCommunityIcons
    name={props.focused ? props.name : nameUnfocused}
    size={25}
    color={props.tintColor} />;
}
export default TabBarIcon