var regexLines = /[^\r\n]+/g;
var regexChords = /<b>(\S+)<\/b>/g;
var commentMarkdown = "";
var tabMarkdown = ["{sot}", "{eot}"];
var breakLine = '\r\n';
var chordOutTextMarkdown = ["[", "]"];
var chordInTextMarkdown = ["[", "]"];

interface MusicChord {
  chord: string,
  index: number,
  chordFromNextLine: boolean
}
interface Line {
  text: string
  index: number
  musicChords: MusicChord[]
}
const replaceHtmlChords = (content: string) => {
  var lines: Line[] = [];
  //separate the text in an array of lines
  let m
  while ((m = regexLines.exec(content)) !== null) {
    if (m.index === regexLines.lastIndex) {
      regexLines.lastIndex++;
    }
    lines.push({
      text: m[0],
      index: m.index,
      musicChords: []
    });
  }
  //put in each line object of the array, a vector of chords
  for (var i = 0; i < lines.length; i++) {
    var chordFromNextLine;//this var tell where is the chord from
    if (checkIfThereIsTextInThisLine(lines[i].text))
      chordFromNextLine = false;
    else {
      if (lines[i + 1] && checkIfThereIsOnlyTextInNextLine(lines[i + 1].text))
        chordFromNextLine = true;
      else
        chordFromNextLine = false;
    }
    var chordPlace = 1;//1 is the first one of the line, 2 is the second ...
    while ((m = regexChords.exec(lines[i].text)) !== null) {
      if (m.index === regexChords.lastIndex) {
        regexChords.lastIndex++;
      }
      if (chordFromNextLine) {
        lines[i + 1].musicChords.push({
          chord: m[1],
          index: indexInLine(m.index, chordPlace),
          chordFromNextLine: chordFromNextLine
        });
        lines.splice(i, 1);
      }
      else
        lines[i].musicChords.push({
          chord: m[1],
          index: indexInLine(m.index, chordPlace),
          chordFromNextLine: chordFromNextLine
        });
      chordPlace++;
    }
    lines[i].text = lines[i].text.replace(regexChords, '');
  }
  var charactersAlreadyAdded = 0;
  for (i = 0; i < lines.length; i++) {
    charactersAlreadyAdded = 0;
    for (var j = 0; j < lines[i].musicChords.length; j++) {
      lines[i].text = addChordSubstring(lines[i].text, lines[i].musicChords[j], charactersAlreadyAdded);
      if (lines[i].musicChords[j].chordFromNextLine === true)
        charactersAlreadyAdded += chordInTextMarkdown[0].length +
          chordInTextMarkdown[1].length +
          lines[i].musicChords[j].chord.length;
      else
        charactersAlreadyAdded += chordOutTextMarkdown[0].length +
          chordOutTextMarkdown[1].length;
    }
  }

  var res = '';
  for (i = 0; i < lines.length; i++) {
    res += lines[i].text + breakLine;
  }
  return res;
};
function checkIfThereIsTextInThisLine(line: string) {
  var lineWithoutChords = line.replace(regexChords, '');
  //any non-whitespace character
  var regex = /\S+/g;
  let m
  if ((m = regex.exec(lineWithoutChords)) !== null)
    return true;
  return false;
}
function checkIfThereIsOnlyTextInNextLine(nextLine: string) {
  //if there is chords in nextLine
  let m
  if ((m = regexChords.exec(nextLine)) !== null)
    return false;
  //if there is tabs or tabs comment in the nextLine
  //if ((m = tabMarkdown.exec(nextLine) !== null || (m = commentMarkdown.exec(nextLine)) !== null))
  //  return false;
  else {
    //any non-whitespace character
    var regex = /\S+/g;
    if ((m = regex.exec(nextLine)) !== null)
      return true;
    return false;
  }
}
//calculate the index of the chord disregarding the '<B>'and '</B>' tags
function indexInLine(chordIndex: number, chordPlace: number) {
  if (chordPlace == 1)
    return chordIndex;//equivalent to the first '<B>' tag
  else
    return chordIndex - 7 * (chordPlace - 1);//equivalent to the '</B> <B>' tags behind the chord
}
function addChordSubstring(line: string, chord: MusicChord, charactersAlreadyAdded: number) {
  var chordStr;
  if (chord.chordFromNextLine === true)
    chordStr = chordInTextMarkdown[0] + chord.chord + chordInTextMarkdown[1];
  else
    chordStr = chordOutTextMarkdown[0] + chord.chord + chordOutTextMarkdown[1];
  return line.substr(0, chord.index + charactersAlreadyAdded) + chordStr + line.substr(chord.index + charactersAlreadyAdded);
}
var regexTab = /<span class="tablatura">(([\s\S])*?<\/span><\/span>)/g;
var commentMarkdown = "";
var tabMarkdown = ["{sot}", "{eot}"];
var breakLine = '\r\n';

const replaceHtmlTabs = (content: string) => {
  var m;
  var tab;
  var k = 1;
  var tempContent = content;
  while ((m = regexTab.exec(tempContent)) !== null) {
    if (m.index === regexTab.lastIndex) {
      regexTab.lastIndex++;
    }

    tab = getTab(m[1]);
    content = content.replace(m[0], tab.comment + tab.tabs);
  }
  return content;
};

function getTab(tabString: string) {
  var regexSubTab = /t">([^]*?)<\/span><\/span>/g;
  var regexComment = /([^]*?)<span class="cnt">/g;
  var tab = {
    "comment": "",
    "tabs": ""
  };
  tabString = tabString.replace(/<u>|<\/u>/g, '');
  var m;
  if ((m = regexComment.exec(tabString)) !== null) {
    if (m.index === regexComment.lastIndex) {
      regexComment.lastIndex++;
    }
    if (m[1] !== null)
      tab.comment = commentMarkdown + m[1];
  }

  if ((m = regexSubTab.exec(tabString)) !== null) {
    if (m.index === regexTab.lastIndex) {
      regexTab.lastIndex++;
    }
    if (m[1] !== null)
      tab.tabs = tabMarkdown[0] + breakLine + m[1] + tabMarkdown[1];
  }
  return tab;
}

export default {
  replaceHtmlChords,
  replaceHtmlTabs
}