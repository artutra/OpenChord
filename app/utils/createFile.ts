import RNFS from 'react-native-fs'

export default async function createFile(filename: string, fileContent: string): Promise<string> {
  var path = RNFS.DocumentDirectoryPath + '/' + filename + '.openchord';
  let exists = await RNFS.exists(path)
  if (exists) {
    await RNFS.unlink(path)
  }
  await RNFS.writeFile(path, fileContent, 'utf8')
  return path
}