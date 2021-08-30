import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';

// STYLES

const Wrapper = styled.div<{ rotateLabel: boolean, lastLabelLength: any, firstLabelLength: any, labelLength: any }>`
  padding-bottom: ${p => p.rotateLabel && p.labelLength / 2 + "ch"};
  padding-left: ${p => p.rotateLabel ?  "2ch" : p.firstLabelLength / 2 + "ch"};
  padding-right: ${p => p.rotateLabel ? p.labelLength / 1.5 + "ch" : p.lastLabelLength / 2 + "ch" };
  width: fit-content;
  max-width: 100%;
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
  margin-top: -3.75rem;
  width: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  white-space: nowrap;
  span{
    border: ${p => p.focused ? `1px solid var(--color-primary)` : `1px solid var(--color-darkgray)`};
    border-radius: 5px;
    color: ${(p) => (p.focused ? "var(--color-white)" : "var(--color-darkgray)")};
    font-weight: ${p => p.focused ? "bold" : "normal"};
    background: ${p => p.focused ? "var(--color-primary)" : "var(--color-white)"};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5rem 0.75rem;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `12px solid var(--color-primary)` : `14px solid var(--color-darkgray)`};
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      margin-top: -1px;
    }&::after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `12px solid var(--color-primary)` : `12px solid ${"var(--color-white)"}`};
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      margin-top: -1px;
    }
  }
`;

const Progress = styled.div<{ focused: boolean, wideTrack: boolean }>`
  position: absolute;
  border-radius: 100px;
  height: ${(p) => (p.wideTrack ? "12px" : "5px")};
  width: 100%;
  z-index: 0;
  border-bottom: ${p => p.wideTrack ? "1px solid var(--color-transparent-gray)" : "none"};
  box-shadow: ${p => p.wideTrack ? "inset 1px 1px 1px 0.5px var(--color-transparent-gray)" : "none"};
  `;

const StyledRangeSlider = styled.input.attrs({ type: "range" }) <{ focused: boolean, wideTrack: boolean }>`
  pointer-events: none;
  cursor: default;
  appearance: none;
  position: absolute;
  width: 100%;
  height: 15px;
  border-radius: 15px;
  background: transparent;
  margin: 20px 0 0 0;
  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    top: ${p => p.wideTrack ? "-22.5px" : "-25px"};
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "2.5em" : "1.5em"};
    height: ${p => p.wideTrack ? "2.5em" : "1.5em"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? p.focused ? "none" : `1px solid var(--color-transparent-gray)` : "none"};
    border-bottom: none;
    box-shadow: 0 1px 1px 0.5px var(--color-transparent-gray);
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,${"var(--color-white)"} 40%,${"var(--color-white)"} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 20%,var(--color-primary) 25%,var(--color-primary) 100%)`
  }
  }
  
  &:focus::-webkit-slider-thumb {
    cursor: grabbing;
    background: ${p =>
    !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,${"var(--color-white)"} 40%,${"var(--color-white)"} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 35%,var(--color-primary) 40%,var(--color-primary) 100%)`};
  }
  
  &::-moz-range-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    height: 3em;
    width: 3em;
    border: 1px solid var(--color-darkgray);
    border-radius: 50%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    appearance: none;
    z-index: 50;
    background: ${p =>
    p.focused
      ? `-moz-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,${"var(--color-white)"} 40%,${"var(--color-white)"} 100%)`
      : `-moz-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 35%,var(--color-primary) 40%,var(--color-primary) 100%)`};
  }

  &:focus::-moz-range-thumb {
    cursor: grabbing;
    background: ${p =>
    !p.focused
      ? `-moz-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,${"var(--color-white)"} 40%,${"var(--color-white)"} 100%)`
      : `-moz-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 35%,var(--color-primary) 40%,var(--color-primary) 100%)`};
  }
`;


const Ticks = styled.div<{ wideTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${p => p.wideTrack ? "17.5px" : "10px"};
  margin-top: ${p => p.wideTrack ? "32px" : "18px"};
`;
const Tick = styled.div<{
  showTicks?: boolean;
  showLabels?: boolean;
  rotateLabel?: boolean;
  labelLength?: number | undefined;
}>`
  position: relative;
  width: 1px;
  height: ${(p) => (p.showTicks ? "5px" : "0")};
  background: var(--color-darkgray);
  margin-bottom: ${(p) =>
    p.showLabels &&
    p.rotateLabel &&
    `${p.labelLength !== undefined && p.labelLength / 2}ch`};
`
const Label = styled.label<{ rotateLabel: boolean }>`
  position: absolute;
  transform: translateX(-50%);
  color: var(--color-darkgray);
  margin-top: 0.5rem;
  transform-origin: center;
  white-space: nowrap;
  text-align: center;
  transform: ${p => p.rotateLabel && "rotate(35deg)"};
  width: ${p => p.rotateLabel && "1px"};
`
;

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
  showLabels: boolean;
  /**
    Show or hide tick marks.
  */
  showTicks: boolean;
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
    The length of the range slider. 
  */
  width: number;
  /**
  The width of the range track.
*/
  wideTrack?: boolean;
  /**
Show or hide tooltip.
*/
  showTooltip?: boolean;

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
  showLabels = true,
  prefix = "",
  suffix = "",
  rotateLabel = false,
  width = 800,
  wideTrack = false,
  showTooltip = false,
}: DualRangeSliderProps) => {
  const lowerRange = useRef() as React.MutableRefObject<HTMLInputElement>;
  const upperRange = useRef() as React.MutableRefObject<HTMLInputElement>;
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [lowerVal, setLowerVal] = useState(initialLowerValue);
  const [upperVal, setUpperVal] = useState(initialUpperValue);
  const [lowerFocused, setLowerFocused] = useState(false);
  const [upperFocused, setUpperFocused] = useState(false);
  const factor = (max - min) / 5;
  const [newLowerVal, setNewLowerVal] = useState(0);
  const [newUpperVal, setNewUpperVal] = useState(0);
  const focused = upperFocused || lowerFocused;

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
  const newValue1 = Number(
    ((lowerVal - min) * 100) / (max - min)
  );
  const newPosition1 = 10 - newValue1 * 0.2;

  // Calculations for positioning upper value tooltip
  const newValue2 = Number(
    ((upperVal - min) * 100) / (max - min)
  );
  const newPosition2 = 10 - newValue2 * 0.2;


  // For collecting tick marks
  function createLabels() {
    if (step > 0) {
      // creates an array of numbers from 'min' to 'max' with 'step' as interval
      const numbers = Array.from(Array(max / step + 1)).map((_, i) => min + step * i);
      // create tick mark for every element in the numbers array 
      return numbers.map((n) => (
        <Tick
          showLabels={showLabels}
          rotateLabel={rotateLabel}
          showTicks={showTicks}
          key={n}
        >
          { // if there are custom labels, show them!
            customLabels?.length > 0
              ? showLabels && customLabels.map((label) => {
                return (
                  n === parseFloat(Object.keys(label)[0]) && (
                    <Label key={n} rotateLabel={rotateLabel} htmlFor={n.toString()}>{Object.values(label)}</Label>
                  )
                )
              })
              // if there are not custom labels, show the default labels (n)
              : showLabels &&
              <Label key={n} rotateLabel={rotateLabel} htmlFor={n.toString()}>
                {prefix + numberWithCommas(n.toFixed(decimals)) + suffix}
              </Label>
          }
        </Tick>
      ));
    }
  };

  const labels = createLabels();


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

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    const cmd = e.metaKey;
    const ctrl = e.ctrlKey;
    const upper = e.currentTarget.id === "upper";
    console.log(upper)

    if (cmd || ctrl) {
      switch (e.code) {
        case "ArrowLeft": //Left
          upper && setUpperVal(upperVal - factor);
          !upper && setLowerVal(lowerVal - factor);
          return;
        case "ArrowDown": //Down
          upper && setUpperVal(upperVal - factor);
          !upper && setLowerVal(lowerVal - factor); return;
        case "ArrowUp": //Up
          upper && setUpperVal(upperVal + factor);
          !upper && setLowerVal(lowerVal + factor); return;
        case "ArrowRight": //Right
          upper && setUpperVal(upperVal + factor);
          !upper && setLowerVal(lowerVal + factor); return;
        default:
          return;
      }
    }
  }
  const firstLabelLength = showLabels && (step > 0) && ticksEl?.current?.firstChild?.firstChild?.textContent?.length;
  const lastLabelLength = showLabels && (step > 0) && ticksEl?.current?.lastChild?.firstChild?.textContent?.length;
  const labelLength = calcLabels();

  function calcLabels() {
    if (lastLabelLength === undefined || firstLabelLength === undefined) return;
    if (firstLabelLength >= lastLabelLength) {
      return firstLabelLength;
    } else {
      return lastLabelLength;
    }
  }

  return (
    <Wrapper
      rotateLabel={rotateLabel}
      firstLabelLength={firstLabelLength}
      lastLabelLength={lastLabelLength}
      labelLength={labelLength}
    >
      <RangeWrap style={{ width: width }}>
        <Progress
          wideTrack={wideTrack}
          focused={focused}
          style={
            !focused && wideTrack ? {
              background: `-webkit-linear-gradient(left,  
                var(--color-white) ${`calc(${newValue2}% + ${newPosition2}px)`},
                var(--color-primary) ${`calc(${newValue2}% + ${newPosition2}px)`},
                var(--color-primary) ${`calc(${newValue1}% + ${newPosition1}px)`},
                var(--color-white) ${`calc(${newValue1}% + ${newPosition1}px)`})`
            } :
              {
                background: `-webkit-linear-gradient(left,  
                  var(--color-secondary) ${`calc(${newValue2}% + ${newPosition2}px)`},
                  var(--color-primary) ${`calc(${newValue2}% + ${newPosition2}px)`},
                  var(--color-primary) ${`calc(${newValue1}% + ${newPosition1}px)`},
                  var(--color-secondary) ${`calc(${newValue1}% + ${newPosition1}px)`})`
              }
          }
        />

        {/* UPPER RANGE */}

        {showTooltip && <RangeOutput
          focused={upperFocused}
          style={{ left: wideTrack ? `calc(${newUpperVal}% + ${newPosition2 * 1.75}px)` : `calc(${newUpperVal}% + ${newPosition2 * 1}px)` }}
        >
          <span>
            {prefix + numberWithCommas(upperVal?.toFixed(decimals)) + suffix}
          </span>
        </RangeOutput>}
        <StyledRangeSlider
          tabIndex={0}
          aria-label="Basic Example"
          aria-orientation="horizontal"
          aria-valuenow={upperVal}
          aria-valuemin={min}
          aria-valuemax={max}
          ref={upperRange}
          min={min}
          max={max}
          step={snap ? step : 0}
          value={upperVal > max ? max : upperVal?.toFixed(decimals)}
          onFocus={() => setUpperFocused(true)}
          onBlur={() => setUpperFocused(false)}
          onInput={(e) => {
            const { valueAsNumber } = e.target as HTMLInputElement;
            setUpperVal(valueAsNumber);
          }}
          onKeyDown={handleKeyPress}
          focused={upperFocused}
          wideTrack={wideTrack}
        />

        {/* LOWER RANGE */}

        {showTooltip && <RangeOutput
          focused={lowerFocused}
          style={{ left: wideTrack ? `calc(${newLowerVal}% + ${newPosition1 * 1.75}px)` : `calc(${newLowerVal}% + ${newPosition1 * 1}px)` }}
        >
          <span>
            {prefix + numberWithCommas(lowerVal?.toFixed(decimals)) + suffix}
          </span>
        </RangeOutput>}
        <StyledRangeSlider
          tabIndex={0}
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
          onKeyDown={handleKeyPress}
          focused={lowerFocused}
          wideTrack={wideTrack}
        />

        <Ticks ref={ticksEl} wideTrack={wideTrack}>{labels}</Ticks>
      </RangeWrap>
    </Wrapper>
  );
};
