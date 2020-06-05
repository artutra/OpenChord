import React from "react"
import IText from "../components/IText"
import { SentenceID } from "../languages/translations"
import { StyleSheet } from "react-native"

const StackHeaderTitle = (props: { text: SentenceID }) => {
  return <IText style={styles.headerTitle} text={props.text} />
}
export default StackHeaderTitle

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.9)',
    textAlign: 'left',
    marginHorizontal: 16
  }
})