import React from "react"
import { FunctionComponent } from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  Text,
  Line,
  Rect,
} from 'react-native-svg';

interface Props {
  height?: number
  width?: number
  chord: Array<string>
  showTuning?: boolean
  tuning?: Array<string>
}
const ChordChart: FunctionComponent<Props> = (props) => {
  let {
    width = 100,
    height = 120,
    showTuning = false,
    tuning = ['E', 'A', 'D', 'G', 'B', 'E'],
    chord
  } = props
  if (chord == null || chord == undefined || chord.length <= 0) {
    chord = ['x', 'x', 'x', 'x', 'x', 'x']
  }
  let fretPosition = 0
  let lower = 100
  chord.forEach(c => {
    if (c != 'x') {
      if (parseInt(c) < lower)
        lower = parseInt(c)
    }
  })
  let normalizedChord = chord.slice()
  if (lower == 100) {
    fretPosition = 0
  } else if (lower >= 3) {
    fretPosition = lower
    for (var i = 0; i < chord.length; i++) {
      normalizedChord[i] = chord[i] == 'x' ? 'x' : (parseInt(chord[i]) - (lower - 1)).toString()
    }
  }
  let barres: any[] = [
    // { from: 6, to: 1, fret: 1 },
    // { from: 4, to: 5, fret: 4 },
  ]

  let tuningContainerHeight = 20
  let chartWidth = width * 0.75
  let chartHeight: number
  if (showTuning) {
    chartHeight = height * 0.75 - tuningContainerHeight
  } else {
    chartHeight = height * 0.75
  }


  let circleRadius = chartWidth / 15
  let bridgeStrokeWidth = Math.ceil(chartHeight / 36)
  let fontSize = Math.ceil(chartWidth / 8)
  let numStrings = chord.length
  let numFrets = 5

  let fretWidth = 1
  let stringWidth = 1

  let defaultColor = '#666'
  let strokeWidth = 1

  let stringSpacing = (chartWidth / numStrings);
  // Add room on sides for finger positions on 1. and 6. string
  let chartXPos = width - chartWidth
  let chartYPos: number
  if (showTuning)
    chartYPos = height - chartHeight - tuningContainerHeight
  else
    chartYPos = height - chartHeight

  let fretLabelTextWidth = 10
  //start draw func
  let fretSpacing = chartHeight / numFrets

  function drawText(x: number, y: number, msg: string) {
    return <Text
      key={"text-" + x + y + msg}
      fill={defaultColor}
      stroke={defaultColor}
      fontSize={fontSize}
      x={x}
      y={y}
      textAnchor="middle"
    >
      {msg}
    </Text>
  }
  function lightUp(stringNum: number, fret: string) {
    const mute = fret === 'x';
    const fretNum = fret === 'x' ? 0 : parseInt(fret);

    let x = chartXPos + stringSpacing * stringNum;
    let y1 = chartYPos + fretSpacing * fretNum - fretSpacing / 2;

    let stringIsLoose = fretNum == 0
    if (!mute && !stringIsLoose) {
      return <Circle
        key={"finger-" + stringNum}
        cx={x}
        cy={y1}
        r={circleRadius}
        strokeWidth={strokeWidth}
        stroke={defaultColor}
        fill={defaultColor}
      />
    }
  }
  function lightBar(stringFrom: number, stringTo: number, fretNum: number) {

    const stringFromNum = numStrings - stringFrom;
    const stringToNum = numStrings - stringTo;

    const y1 = chartYPos + fretSpacing * (fretNum - 1) + fretSpacing / 2;
    return <Line
      strokeWidth={circleRadius * 2}
      strokeLinecap={"round"}
      stroke={defaultColor}
      x1={chartXPos + stringSpacing * stringFromNum}
      y1={y1}
      x2={chartXPos + stringSpacing * stringToNum}
      y2={y1}
    />
  }
  return (
    <View
      style={[
        { height: props.height, width: props.width },
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Svg height={props.height} width={props.width}>
        {// Draw guitar bridge
          fretPosition <= 1 ?
            <Rect
              fill={defaultColor}
              width={chartWidth - stringSpacing}
              height={bridgeStrokeWidth}
              x={chartXPos}
              y={chartYPos}
            /> :
            // Draw fret position
            drawText(
              chartXPos - fretLabelTextWidth,
              chartYPos + fontSize - fretWidth + (fretSpacing - fontSize) / 2,
              `${fretPosition}º`)
        }
        {// Draw strings
          Array.from(Array(numStrings)).map((s, i) => {
            return (
              <Line
                key={"string-" + i}
                strokeWidth={stringWidth}
                stroke={defaultColor}
                x1={chartXPos + (stringSpacing * i)}
                y1={chartYPos}
                x2={chartXPos + (stringSpacing * i)}
                y2={chartYPos + fretSpacing * numFrets}
              />
            )
          })}
        {// Draw frets
          Array.from(Array(numFrets)).map((f, i) => {
            return (
              <Line
                key={"fret-" + i}
                strokeWidth={fretWidth}
                stroke={defaultColor}
                x1={chartXPos}
                y1={chartYPos + fretSpacing * i}
                x2={chartXPos + stringSpacing * (numStrings - 1)}
                y2={chartYPos + fretSpacing * i}
              />
            )
          })}
        {// Draw mute and loose strings icons
          normalizedChord.map((c, i) => {
            if (c == 'x') {
              return drawText(
                chartXPos + stringSpacing * i,
                chartYPos - fontSize, 'X')
            } else if (c == '0') {
              return <Circle
                key={"circle-" + i}
                cx={chartXPos + stringSpacing * i}
                cy={chartYPos - fontSize - circleRadius}
                r={circleRadius}
                strokeWidth={strokeWidth}
                stroke={defaultColor}
                fill="none"
              />
            }
          })
        }
        {// Draw finger circles
          normalizedChord.map((c, i) => {
            return lightUp(i, c)
          })
        }
        {// Draw barres
          barres.map(barre => {
            return lightBar(barre.from, barre.to, barre.fret);
          })
        }

        {// Draw tuning
          showTuning && tuning.length == numStrings &&
          tuning.map((t, i) => {
            return drawText(
              chartXPos + stringSpacing * i,
              chartYPos + chartHeight + fontSize,
              t);
          })
        }
      </Svg>
    </View>
  );
}
export default ChordChart