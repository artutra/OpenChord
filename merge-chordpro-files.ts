import fs from 'fs'
import path from 'path'

function readFilesSync(dir: string) {
  const files: string[] = [];
  const fileType = process.argv[2] == 'debug' ? 'debug' : 'prod'
  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    let testExtension = fileType == 'debug' ? name.endsWith('.test') : !name.endsWith('.test')
    if (ext != '.json' && testExtension) {
      const filepath = path.resolve(dir, filename);
      const content = fs.readFileSync(filepath, 'utf-8')
      const stat = fs.statSync(filepath);
      const isFile = stat.isFile();
      if (isFile) files.push(content);
    }
  })
  return files;
}
var assetsPath = './app/assets/chordpro'
const data = readFilesSync(assetsPath);
const result = { updated_at: new Date(), data }
const jsonContent = JSON.stringify(result)
fs.writeFile(assetsPath + "/songs.json", jsonContent, 'utf8', function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    console.log(err);
  } else {
    console.log('./assets/chordpro/songs.json generated successfully!')
  }
});