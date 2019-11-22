import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Modal, Button, TextInput } from "react-native";

export interface Option {
  title: string
  onPress: () => void
}
interface CreatePlaylistModalProps {
  enabled: boolean
  onDismiss: () => void
  onPressCreate: (playlistName: string) => void
}
const CreatePlaylistModal: FunctionComponent<CreatePlaylistModalProps> = (props) => {
  const [name, setName] = useState("")
  const textInput = useRef<TextInput>(null)
  const { enabled, onDismiss } = props
  useEffect(() => {
    if (enabled && textInput.current) {
      textInput.current.focus()
    }
  }, [enabled])
  if (!enabled) return null

  return (
    <Modal transparent onDismiss={onDismiss}>
      <View style={styles.backgroundOverlayer}>
        <TouchableOpacity style={styles.outsideContainer} onPress={onDismiss} />
        <View style={styles.container}>
          <TextInput ref={textInput} placeholder="Playlist name" onChangeText={setName} value={name} />
          <Button onPress={() => props.onPressCreate(name)} title="CREATE" />
        </View>
      </View>
    </Modal>
  );
}
export default CreatePlaylistModal

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