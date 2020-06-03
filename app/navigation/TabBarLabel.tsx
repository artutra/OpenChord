import React from "react"
import IText from "../components/IText"
import { SentenceID } from "../languages/translations"
import { StyleSheet } from "react-native"

const TabBarLabel = (props: { text: SentenceID }) => {
  return <IText style={styles.label} text={props.text} />
}
export default TabBarLabel

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 1.5,
    color: 'gray',
    textAlign: 'center'
  }
})