import React, { FunctionComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Modal } from "react-native";

export interface Option {
  title: string
  onPress: () => void
}
interface OptionsMenuProps {
  enabled: boolean
  options: Option[]
  onDismiss: () => void
}
const OptionsMenu: FunctionComponent<OptionsMenuProps> = (props) => {
  let { enabled, onDismiss, options } = props
  if (!enabled) return null
  return (
    <Modal transparent onDismiss={onDismiss}>
      <View style={styles.backgroundOverlayer}>
        <TouchableOpacity style={styles.outsideContainer} onPress={onDismiss} />
        <View style={styles.container}>
          {options.map(option => {
            return (
              <TouchableOpacity
                key={option.title}
                style={styles.optionItem}
                onPress={() => {
                  onDismiss()
                  option.onPress()
                }}>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </Modal>
  );
}
export default OptionsMenu

const styles = StyleSheet.create({
  backgroundOverlayer: {
    backgroundColor: '#00000040',
    flex: 1,
    justifyContent: 'flex-end'
  },
  outsideContainer: {
    flex: 1
  },
  container: {
    backgroundColor: 'white'
  },
  optionItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionTitle: {
    paddingVertical: 20,
    fontSize: 18
  }
});