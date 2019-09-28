import React, { useState, useEffect } from "react";
import { View, } from "react-native";
import Svg, {
  Circle,
  Text,
  Line,
  Rect,
} from 'react-native-svg';

interface Props {
  height: number
  width: number
  chord: string
  showTuning?: boolean
  tuning?: Array<string>
}
const ChordChart = (props: Props) => {
  let chord = props.chord
  let {
    width = 100,
    height = 120,
    showTuning = false,
    tuning = ['E', 'A', 'D', 'G', 'B', 'E']
  } = props
  let position = 0
  let lower = 100
  Array.from(chord).forEach(c => {
    if (c != 'x') {
      if (parseInt(c) < lower)
        lower = parseInt(c)
    }
  })
  if (lower >= 3) {
    position = lower
    let s = ''
    for (var i = 0; i < chord.length; i++) {
      s = s + (chord[i] == 'x' ? 'x' : (parseInt(chord[i]) - (lower - 1)).toString())
    }
    chord = s
  }
  let barres: any[] = [
    //{ from: 6, to: 1, fret: 1 },
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

  let barreRadius = chartWidth / 25
  let barShiftX = chartWidth / 28
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
        cx={x}
        cy={y1}
        r={circleRadius}
        strokeWidth={strokeWidth}
        stroke={defaultColor}
        fill={defaultColor}
      />
    }
  }
  function lightBar(stringFrom: number, stringTo: number, theFretNum: number) {
    let fretNum = theFretNum;

    const stringFromNum = numStrings - stringFrom;
    const stringToNum = numStrings - stringTo;

    const x1 = chartXPos + stringSpacing * stringFromNum - barShiftX;
    const xTo = chartXPos + stringSpacing * stringToNum + barShiftX;

    const y1 = chartYPos + fretSpacing * (fretNum - 1) + fretSpacing / 2;

    return <Line
      strokeWidth={circleRadius * 2}
      strokeLinecap={"round"}
      stroke={defaultColor}
      x1={x1}
      y1={y1}
      x2={xTo}
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
      <Svg height={props.height} width={props.width} style={{ backgroundColor: 'yellow' }}>
        {// Draw guitar bridge
          position <= 1 ?
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
              `${position}º`)
        }
        {// Draw strings
          Array.from(Array(numStrings)).map((s, i) => {
            return (
              <Line
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
          Array.from(chord).map((c, i) => {
            if (c == 'x') {
              return drawText(
                chartXPos + stringSpacing * i,
                chartYPos - fontSize, 'X')
            } else if (c == '0') {
              return <Circle
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
          Array.from(chord).map((c, i) => {
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