import React, { FunctionComponent } from "react";
import { Text, StyleSheet, View } from "react-native";
import TouchableIcon from "../../../components/TouchableIcon";

interface DraggableItemProps {
  title: string
  subtitle?: string
  onPressDelete: () => void
  onDragEnd: () => void
  onDragStart: () => void
}
const DraggableItem: FunctionComponent<DraggableItemProps> = (props) => {
  let { title, subtitle, onDragStart, onDragEnd, onPressDelete } = props
  return (
    <View style={styles.item}>
      <TouchableIcon style={styles.deleteIcon} size={20} onPress={onPressDelete} name="minus-circle-outline" />
      <View style={styles.labelAndDragContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <TouchableIcon activeOpacity={1} onPressIn={onDragStart} onPressOut={onDragEnd} name="drag" />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    paddingVertical: 5
  },
  deleteIcon: {
    flex: 0
  },
  textContainer: {
    flex: 1
  },
  labelAndDragContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18
  },
  subtitle: {
    fontSize: 14
  }
})
export default DraggableItem