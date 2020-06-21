import React, { FC } from "react";
import { StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useDimensions } from "../../../utils/useDimensions";

interface Props {
  isOpen: boolean
  onDismiss: () => void
}
const SideMenu: FC<Props> = ({ isOpen, onDismiss, children }) => {
  const { isLandscape, windowData } = useDimensions()

  if (!isOpen) return null

  const maxHeight = windowData.height
  const heightStyle = isLandscape ? { height: maxHeight - 50 } : {}
  return (
    <Modal transparent onDismiss={onDismiss}  >
      <TouchableOpacity style={styles.backgroundOverlayer} onPress={onDismiss} />
      <ScrollView style={[styles.fixed, heightStyle]} contentContainerStyle={[styles.card]}>
        {children}
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backgroundOverlayer: {
    flex: 1,
    backgroundColor: '#00000020',
  },
  fixed: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  card: {
    display: 'flex',
    borderRadius: 4,
    elevation: 2,
    backgroundColor: 'white',
  },
})
export default SideMenu