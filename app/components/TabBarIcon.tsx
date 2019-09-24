import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props {
  focused: boolean
  horizontal: boolean
  tintColor: string
  name: string
}

const TabBarIcon = (props: Props) => {
  return <MaterialCommunityIcons
    name={`${props.name}${props.focused ? '' : '-outline'}`}
    size={25}
    color={props.tintColor} />;
}
export default TabBarIcon