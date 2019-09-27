import React, { FunctionComponent } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void
  iconStyle?: StyleProp<ViewStyle>
  size?: number
  name: string
  color?: string
}

const TouchableIcon: FunctionComponent<Props> = ({ onPress, size = 30, name, color, iconStyle }) => {
  return (
    <TouchableOpacity onPress={onPress}>
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