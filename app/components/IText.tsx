import React, { useContext, FC } from "react";
import { TextProps, Text } from "react-native";
import LanguageContext, { SentenceID } from "../languages/LanguageContext";

interface Props extends TextProps {
  text: SentenceID
}
const IText: FC<Props> = (props) => {
  const { text, style } = props
  const { t } = useContext(LanguageContext)
  return <Text {...props} style={style}>{t(text)}</Text>
}
export default IText