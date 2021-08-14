import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';

// STYLES
const blackColor = "#999";
const whiteColor = "white";

const Wrapper = styled.div<{ rotateLabel: boolean, lastLabelLength: any, firstLabelLength: any }>`
  padding-right: ${p => p.rotateLabel ? p.lastLabelLength / 1.75 + "ch" : p.lastLabelLength / 3.5 + "ch"};
  padding-left: ${p => p.rotateLabel ? p.firstLabelLength / 1.75 + "ch" : p.firstLabelLength / 3.5 + "ch"};
`;

const RangeWrap = styled.div`
  position: relative;
  padding-top: 3.75rem;
  padding-bottom: 1.75rem;
  font-family: sans-serif;
  max-width: 100%;
  user-select: none;
`;

const RangeOutput = styled.output<{ focused: boolean; }>`
  margin-top: -4.75rem;
  width: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  white-space: nowrap;
  span{
    border: ${p => p.focused ? `1px solid ${focusColor}` : `1px solid ${blackColor}`};
    border-radius: 5px;
    color: ${p => p.focused ? whiteColor : blackColor};
    background: ${p => p.focused ? focusColor : whiteColor};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5rem 0.75rem;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `12px solid ${focusColor}` : `0px`};
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      margin-top: -1px;
    }
  }
`;

const Progress = styled.div<{ focused: boolean; }>`
  z-index: 0;
  box-shadow: inset 1px 1px 2px hsla(0, 0%, 0%, 0.25), inset 0px 0px 2px hsla(0, 0%, 0%, 0.25);
  border-radius: 15px;
  width: 100%;
  height: 15px;
`;

const StyledRangeSlider = styled.input.attrs({ type: "range" }) <{ focused: boolean; }>`
  appearance: none;
  cursor: pointer;
  pointer-events: none;
  margin: 0;
  width: 100%;
  height: 15px;
  border-radius: 15px;
  border: 0;
  position: absolute;
  z-index: 2;
  background: transparent;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-thumb {
    position: relative;
    height: 3em;
    width: 3em;
    border: 1px solid ${blackColor};
    border-radius: 50%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    cursor: grab;
    -webkit-appearance: none;
    z-index: 50;
    margin-top: -2.5em;
    pointer-events: all;
    background: ${p => !p.focused ?
    `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)` :
    `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
  };
}
  &::-moz-range-thumb {
    position: relative;
    height: 3em;
    width: 3em;
    border: 1px solid ${blackColor};
    border-radius: 50%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    cursor: grab;
    appearance: none;
    margin-top: -2.5em;
    pointer-events: all;
    z-index: 50;
    background: ${p => !p.focused ?
    `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)` :
    `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
  };
}
`;

const Ticks = styled.div<{ rotateLabel: boolean; }>`
  display: flex;
  justify-content: space-between;
  margin: 15px 20px 0;
  margin-bottom: ${p => p.rotateLabel && "-20px"}
`;

const Tick = styled.div<{ rotateLabel: boolean; labelLength: number; showLabel: boolean; showTicks: boolean; }>`
  position: relative;
  width: 1px;
  height: 5px;
  background: ${blackColor};
  margin-bottom: ${p => p.rotateLabel && `${p.labelLength / 2}ch`};
  div{
    width: 0;
    color: ${blackColor};
    transform-origin: top center;
    margin-top: 0.5rem;
    margin-left: ${p => !p.rotateLabel ? p.labelLength / 2.5 * -1 + "ch" : "0.5rem"};
    transform: ${p => p.rotateLabel ? "rotate(35deg)" : "rotate(0deg)"};
    white-space: nowrap;
  }
`;

let newValue1 = 0;
let newValue2 = 0;
let newPosition1 = 0;
let newPosition2 = 0;
let focusColor = "";

function numberWithCommas(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface DualRangeSliderProps {
  /**
    The initial upper value.
  */
  initialUpperValue: number;
  /**
    The initial upper value.
  */
  initialLowerValue: number;
  /**
    The minimum value.
  */
  min: number;
  /**
    The maximum value. 
  */
  max: number;
  /**
    The amount of decimal points to be rounded to. 
  */
  decimals: number;
  /**
    The invterval between ticks.
  */
  step: number;
  /**
    Show or hide tick marks.
  */
  showTicks: boolean;
  /**
    Snap to ticks or scroll smoothly.
  */
  snap: boolean;
  /**
    For creating custom labels. 
  */
  customLabels: Array<Record<number, string>>;
  /**
    Show or hide labels.
  */
  showLabel: boolean;
  /**
    Optional text displayed before value. 
  */
  prefix?: string;
  /**
    Optional text displayed after value.
  */
  suffix?: string;
  /**
    The amount in degrees to rotate the labels.
  */
  rotateLabel?: boolean;
  /**
    The focus color. 
  */
  blurColor: string;
  /**
    The blur color. 
  */
  primaryColor: string;
  /**
    The width of the range slider.
  */
  width: number;
}

export const DualRangeSlider = ({
  initialLowerValue = 20,
  initialUpperValue = 80,
  min = 0,
  max = 100,
  decimals = 0,
  step = 10,
  showTicks = true,
  snap = true,
  customLabels = [],
  showLabel = true,
  prefix = "",
  suffix = "",
  rotateLabel = false,
  blurColor = "grey",
  primaryColor = "black",
  width = 800
}: DualRangeSliderProps) => {
  const lowerRange = useRef(null);
  const upperRange = useRef(null);
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [lowerVal, setLowerVal] = useState(initialLowerValue);
  const [upperVal, setUpperVal] = useState(initialUpperValue);
  const [lowerFocused, setLowerFocused] = useState(false);
  const [upperFocused, setUpperFocused] = useState(false);
  const [newLowerVal, setNewLowerVal] = useState(0);
  const [newUpperVal, setNewUpperVal] = useState(0);

  focusColor = primaryColor;
  blurColor = blurColor;

  useEffect(() => {
    setNewLowerVal(Number(((lowerVal - min) * 100) / (max - min)));
    setNewUpperVal(Number(((upperVal - min) * 100) / (max - min)));
  }, [lowerVal, upperVal, min, max]);

  // Make sure min never exceds max
  if (min > max) {
    min = max;
  }
  // Make sure max is never less than min
  if (max < min) {
    max = min;
  }

  // Calculations for positioning lower value tooltip
  newValue1 = Number(
    ((lowerVal - min) * 100) / (max - min)
  );
  newPosition1 = 10 - newValue1 * 0.2;

  // Calculations for positioning upper value tooltip
  newValue2 = Number(
    ((upperVal - min) * 100) / (max - min)
  );
  newPosition2 = 10 - newValue2 * 0.2;


  // For collecting tick marks
  let markers = [];
  if (customLabels?.length !== 0) {
    if (step > 0) {
      for (let i = min; i <= max; i += step) {
        let labelLength = 0;
        let customTickText: string[] = [];
        let tickText = numberWithCommas(i.toFixed(decimals));
        labelLength = tickText.toString().length;
        customLabels.map((label) => {
          console.log(Object.values(label)[0]);
          if (parseInt(tickText, 10) === parseInt(Object.keys(label)[0], 10)) {
            customTickText = Object.values(label);
          }
          return null;
        });
        if (customTickText !== null) labelLength = customTickText[0]?.length;
        markers.push(
          <Tick
            key={i}
            labelLength={labelLength}
            showLabel={showLabel}
            rotateLabel={rotateLabel}
            showTicks={showTicks}
          >
            {showLabel && <div>{customTickText}</div>}
          </Tick>
        );
      }
    }
  } else {
    if (step > 0) {
      for (let i = min; i <= max; i += step) {
        let tickText = prefix + numberWithCommas(i.toFixed(decimals)) + suffix;
        const labelLength: number = tickText.toString().length;
        console.log(labelLength);
        markers.push(
          Tick && (
            <Tick
              key={i}
              labelLength={labelLength}
              rotateLabel={rotateLabel}
              showLabel={showLabel}
              showTicks={showTicks}
            >
              {showLabel && <div>{tickText}</div>}
            </Tick>
          )
        );
      }
    }
  }

  const marks = markers.map((marker) => marker);

  //If the upper value slider is LESS THAN the lower value slider.
  if (upperVal > lowerVal) {
    //The lower slider value is set to equal the upper value slider.
    setLowerVal(upperVal);
    //If the lower value slider equals its set minimum.
    if (lowerVal === 0) {
      //Set the upper slider value to equal min.
      setUpperVal(min);
    }
  }
  //If the lower value slider is GREATER THAN the upper value slider minus one.
  if (lowerVal < upperVal - 1) {
    //The upper slider value is set to equal the lower value slider plus one.
    setUpperVal(lowerVal);
    //If the upper value slider equals its set maximum.
    if (upperVal === max) {
      //Set the lower slider value to equal the upper value slider's maximum value minus one.
      setLowerVal(max);
    }
  }

  return (
    <Wrapper
      rotateLabel={rotateLabel}
      firstLabelLength={showLabel && (step > 0) && ticksEl?.current?.firstChild?.firstChild?.textContent?.length}
      lastLabelLength={showLabel && (step > 0) && ticksEl?.current?.lastChild?.firstChild?.textContent?.length}
    >
      <RangeWrap style={{ width: width }}>
        <Progress
          focused={lowerFocused || upperFocused}
          style={{
            background: lowerFocused || upperFocused ?
              `-webkit-linear-gradient(left, ${whiteColor} ${`calc(${newUpperVal}% + ${newPosition2 * 2}px)`},${focusColor} ${`calc(${newUpperVal}% + ${newPosition2 * 2}px)`},${focusColor} ${`calc(${newLowerVal}% + ${newPosition1 * 2}px)`},${whiteColor} ${`calc(${newLowerVal}% + ${newPosition1 * 2}px)`})` :
              `-webkit-linear-gradient(left, ${whiteColor} ${`calc(${newUpperVal}% + ${newPosition2 * 2}px)`},${blurColor} ${`calc(${newUpperVal}% + ${newPosition2 * 2}px)`},${blurColor} ${`calc(${newLowerVal}% + ${newPosition1 * 2}px)`},${whiteColor} ${`calc(${newLowerVal}% + ${newPosition1 * 2}px)`})`
          }}
        />

        {/* LOWER RANGE */}
        <RangeOutput
          focused={lowerFocused}
          style={{ left: `calc(${newLowerVal}% + ${newPosition1 * 2}px)` }}
          className="range-value"
        >
          <span>{lowerVal ? lowerVal.toFixed(decimals) : 0}</span>
        </RangeOutput>
        <StyledRangeSlider
          tabIndex={2}
          ref={lowerRange}
          type="range"
          min={min}
          max={max}
          value={lowerVal}
          step={snap ? step : 0}
          onFocus={() => setLowerFocused(true)}
          onBlur={() => setLowerFocused(false)}
          onInput={e => {
            const { valueAsNumber } = e.target as HTMLInputElement;
            setLowerVal(valueAsNumber);
          }}
          focused={lowerFocused}
        />

        {/* UPPER RANGE */}
        <RangeOutput
          focused={upperFocused}
          style={{ left: `calc(${newUpperVal}% + ${newPosition2 * 2}px)` }}
          className="range-value"
        >
          <span>{upperVal ? upperVal.toFixed(decimals) : 0}</span>
        </RangeOutput>
        <StyledRangeSlider
          tabIndex={1}
          ref={upperRange}
          type="range"
          min={min}
          max={max}
          value={upperVal}
          step={snap ? step : 0}
          onFocus={() => setUpperFocused(true)}
          onBlur={() => setUpperFocused(false)}
          onInput={e => {
            const { valueAsNumber } = e.target as HTMLInputElement;
            setUpperVal(valueAsNumber);
          }}
          focused={upperFocused}
        />
        {showTicks ? <Ticks ref={ticksEl} rotateLabel={rotateLabel}>{marks}</Ticks> : null}
      </RangeWrap>
    </Wrapper>
  );
};
