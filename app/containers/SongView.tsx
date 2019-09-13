import React, { useState } from "react";
import { Text } from "react-native";

const SongView = () => {
  const [content] = useState(`
    Am         C/G        F          C
  Let it be, let it be, let it be, let it be
  C                G              F  C/E Dm C
  Whisper words of wisdom, let it be`)
  return (
    <Text>{content}</Text>
  );
}
export default SongView