import React, { FunctionComponent } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  iconStyle?: StyleProp<ViewStyle>
  size?: number
  name: string
  color?: string
}

const TouchableIcon: FunctionComponent<Props> = (props) => {
  let { size = 30, name, color, iconStyle } = props
  return (
    <TouchableOpacity {...props}>
      <MaterialCommunityIcons
        style={[styles.iconPadding, iconStyle]}
        name={name}
        size={size}
        color={color} />
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  iconPadding: {
    padding: 10
  }
})
export default TouchableIcon