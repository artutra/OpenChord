import React, { FC } from "react"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Checkbox: FC<{
  value: boolean,
  onValueChange: (value: boolean) => void
}> = ({ value, onValueChange }) => {
  if (value) return <MaterialCommunityIcons onPress={() => onValueChange(false)} size={30} name="check-box-outline" />
  return <MaterialCommunityIcons onPress={() => onValueChange(true)} size={30} name="checkbox-blank-outline" />
}
export default Checkbox