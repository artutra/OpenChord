import 'react-native';
import CifraclubParser from '../../app/utils/CifraclubParser';

it('parse to chord pro correctly', () => {
  let htmlSong =
    "  <b>D</b>              <b>G</b>\n" +
    "Se sei vicino, se sei lontano\n" +
    "<b>D</b>               <b>G</b>\n" +
    "Quando ti penso mi calmo piano, piano\n"
  let chordPro = new CifraclubParser().parse(htmlSong)
  let res =
    "Se[D] sei vicino, se[G] sei lontano\n" +
    "[D]Quando ti penso [G]mi calmo piano, piano" +
    "\n"
  expect(chordPro).toBe(res)
})

it('parse inline chords correctly', () => {
  let htmlSong = "(<b>D</b> <b>G</b>  <b>Gm</b> )\n"
  let chordPro = new CifraclubParser().parse(htmlSong)
  let res = "([D] [G]  [Gm] )\n"
  expect(chordPro).toBe(res)
})

it('add spaces when lyrics are to short', () => {
  let htmlSong =
    "  <b>D</b>                                   <b>G</b>\n" +
    "Se sei vicino, se sei lontano\n"
  let chordPro = new CifraclubParser().parse(htmlSong)
  let res = "Se[D] sei vicino, se sei lontano         [G]\n"
  expect(chordPro).toBe(res)
})

it('parse tabs correctly', () => {
  let html = `
<span class="tablatura">   <b>C</b>                        
<span class="cnt">e|<u>---------------------------</u>
B|<u>---------------------------</u>
G|<u>------</u>0<u>--------------------</u>
D|<u>--</u>0h2<u>---</u>2<u>------</u>2<u>-----------</u>
A|3<u>----------</u>3<u>-</u>3<u>---</u>3<u>-</u>3<u>-</u>3<u>--</u>2<u>--</u>
E|<u>---------------------------</u>
</span></span>`
  let res =
    "   [C]                        \n" +
    "{sot}\n" +
    "e|---------------------------\n" +
    "B|---------------------------\n" +
    "G|------0--------------------\n" +
    "D|--0h2---2------2-----------\n" +
    "A|3----------3-3---3-3-3--2--\n" +
    "E|---------------------------\n" +
    "{eot}\n\n"
  let chordPro = new CifraclubParser().parse(html)
  expect(chordPro).toBe(res)
})