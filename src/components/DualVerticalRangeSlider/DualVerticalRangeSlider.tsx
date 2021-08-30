import { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

// STYLES

const RangeWrap = styled.div<{ heightVal: number, maxLabelLength: number, showTicks: boolean }>`
  width: ${p => p.heightVal + "px"};
  /* margin-left: ${p => `${p.maxLabelLength}em`}; */
  padding-top: ${p => `${p.maxLabelLength / 2.5}ch`};
  transform: rotate(270deg);
  transform-origin: top left;
  margin-top: ${p => p.heightVal + "px"};
  left: 0;
  top: 0;
  font-family: sans-serif;
  /* border: 1px dotted red; */
`;

const RangeOutput = styled.output<{ focused: boolean, wideTrack: boolean }>`
  width: 0;
  user-select: none;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  margin-top: ${p => p.wideTrack ? "2.5em" : "2em"};
  margin-left: -1rem;
  span {
    writing-mode: vertical-lr;
    border: ${(p) => !p.focused ? `1px solid var(--color-primary)` : `1px solid var(--color-darkgray)`};
    border-radius: 5px;
    color: ${(p) => (!p.focused ? "var(--color-white)" : "var(--color-darkgray)")};
    font-weight: ${p => !p.focused ? "bold" : "normal"};
    background: ${(p) => (!p.focused ? "var(--color-primary)" : "var(--color-white)")};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5em;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => !p.focused ? `12px solid var(--color-primary)` : `14px solid var(--color-darkgray)`};
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      bottom: 100%;
      margin-left: -4px;
      margin-top: -1px;
      transform: rotate(180deg);
      transform-origin: 75%;
    }&::after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => !p.focused ? `12px solid var(--color-primary)` : `12px solid ${"var(--color-white)"}`};
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      bottom: 100%;
      margin-left: -2px;
      margin-bottom: -1px;
      transform: rotate(180deg);
      transform-origin: 75%;
    }
  }
`;


const Progress = styled.div<{ focused: boolean, wideTrack: boolean }>`
  position: absolute;
  border-radius: 100px;
  height: ${(p) => (p.wideTrack ? "12px" : "5px")};
  width: 100%;
  z-index: 0;
  border-bottom: 1px solid var(--color-transparent-gray);
  border-bottom: ${p => p.wideTrack ? "1px solid var(--color-transparent-gray)" : "none"};
  box-shadow: ${p => p.wideTrack ? "inset 1px 1px 1px 0.5px var(--color-transparent-gray)" : "none"}
`;

const StyledRangeSlider = styled.input.attrs({
  type: "range",
  role: "slider",
}) <{ focused: boolean; wideTrack: boolean; heightVal: number }>`
  cursor: default;
  pointer-events: none;
  appearance: none;
  position: absolute;
  width: 100%;
  height: ${p => p.wideTrack ? "12px" : "8px"};
  border-radius: 15px;
  background: transparent;
  margin: 0;
  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "2.5em" : "1.5em"};
    height: ${p => p.wideTrack ? "2.5em" : "1.5em"};
    top: ${p => p.wideTrack ? "0" : "-1.5px"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? p.focused ? "1px solid var(--color-primary)" : `1px solid var(--color-lightgray)` : "none"};
    box-shadow: -1px 0 5px 0 rgba(0, 0, 0, 0.25);
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
    height: 2.5em;
    width: 2.5em;
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
  margin: ${p => p.wideTrack ? "15px" : "10px"};
  margin-top: ${p => p.wideTrack ? "32px" : "12px"};
  position: relative;
  top: -3.5em;
`;

const Tick = styled.div<{
  showTicks?: boolean;
  showLabels?: boolean;
  rotateLabel?: boolean;
  labelLength?: number | undefined;
  focused?: boolean;
  maxLabelLength: number
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: flex-end;
  width: 1px;
  height: 5px;
  background: ${p => p.showTicks ? "var(--color-darkgray)" : "transparent"};
  label {
    color: var(--color-darkgray);
    display: block;
    writing-mode: vertical-rl;
    margin-left: 0.65em;
    margin-bottom: 0.5rem;
    white-space: nowrap;
  }
`;

function numberWithCommas(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface DualVerticalRangeSliderProps {
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
  showLabels: boolean;
  /**
    Optional text displayed before value. 
  */
  prefix?: string;
  /**
    Optional text displayed after value.
  */
  suffix?: string;
  /**
    The width of the range slider.
  */
  height: number;
  /**
    The width of the range track.
  */
  wideTrack?: boolean;
  /**
  Show or hide tooltip.
  */
  showTooltip?: boolean;

}

export const DualVerticalRangeSlider = ({
  initialLowerValue = 20,
  initialUpperValue = 80,
  min = 0,
  max = 100,
  decimals = 0,
  step = 10,
  showTicks = true,
  snap = true,
  customLabels = [
    { 0: "low" },
    { 50: "medium" },
    { 100: "high" }
  ],
  showLabels = true,
  prefix = "",
  suffix = "",
  height = 400,
  wideTrack = true,
  showTooltip = false,
}: DualVerticalRangeSliderProps) => {
  const lowerRange = useRef<HTMLInputElement | null>(null);
  const upperRange = useRef<HTMLInputElement | null>(null);
  const tickEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [upperVal, setUpperVal] = useState(initialUpperValue);
  const [lowerVal, setLowerVal] = useState(initialLowerValue);
  const [newValue1, setNewValue1] = useState(0);
  const [newValue2, setNewValue2] = useState(0);
  const [upperFocused, setUpperFocused] = useState(false);
  const [lowerFocused, setLowerFocused] = useState(false);
  const [maxLabelLength, setMaxLabelLength] = useState(0);
  const factor = (max - min) / 5;
  const focused = upperFocused || lowerFocused;
  const newPosition1 = 10 - newValue1 * 0.2;
  const newPosition2 = 10 - newValue2 * 0.2;

  // Make sure min never exceds max
  if (min > max) {
    min = max;
  }
  // Make sure max is never less than min
  if (max < min) {
    max = min;
  }

  useLayoutEffect(() => {
    setNewValue1(Number(((lowerVal - min) * 100) / (max - min)));
    setNewValue2(Number(((upperVal - min) * 100) / (max - min)));
    if (showTicks) {
      const numbers = Array.from(tickEl.current?.children).map((_, i) => {
        return min + step * i;
      });
      setMaxLabelLength(Math.max(numbers.toString().length))
      console.log(numbers)
      // const tickText: number[] = numbers.map(number => number.toString().length)
      // showLabels &&
      //   tickText !== undefined && numbers.push(tickText[0]);
    }
  }, [min, max, lowerVal, upperVal, showLabels, showTicks, step]);

  // For collecting tick marks
  function createLabels() {
    if (step > 0) {
      // creates an array of numbers from 'min' to 'max' with 'step' as interval
      const numbers = Array.from(Array(max / step + 1)).map((_, i) => min + step * i);
      // create tick mark for every element in the numbers array 
      return numbers.map((n) => (
        <Tick
          key={n}
          maxLabelLength={maxLabelLength}
          showLabels={showLabels}
          showTicks={showTicks}
        >
          { // if there are custom labels, show them!
            customLabels?.length > 0
              ? showLabels && customLabels.map((label) => {
                return (
                  n === parseFloat(Object.keys(label)[0]) && (
                    <label key={n} htmlFor={n.toString()}>{Object.values(label)}</label>
                  )
                )
              })
              // if there are not custom labels, show the default labels (n)
              : showLabels &&
              <label key={n} htmlFor={n.toString()}>
                {prefix + numberWithCommas(n.toFixed(decimals)) + suffix}
              </label>
          }
        </Tick>
      ));
    }
  };
  const labels = createLabels();

  //If the upper value slider is LESS THAN the lower value slider.
  if (upperVal > lowerVal) {
    //Set lower slider value to equal the upper value slider.
    setLowerVal(upperVal);
    //If the lower value slider equals its set minimum.
    if (lowerVal === 0) {
      //Set the upper slider value to equal min.
      setUpperVal(min);
    }
  };
  //If the lower value slider is GREATER THAN the upper value slider minus one.
  if (lowerVal < upperVal - 1) {
    //Set the upper slider value equal to the lower value slider.
    setUpperVal(lowerVal);
    //If the upper value slider equals its set maximum.
    if (upperVal === max) {
      //Set the lower slider value to equal the upper max.
      setLowerVal(max);
    }
  };

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

  return (
    <RangeWrap
      showTicks={showTicks}
      heightVal={height}
      maxLabelLength={maxLabelLength}
    >
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
        wideTrack={wideTrack}
        style={{ left: wideTrack ? `calc(${newValue1}% + ${newPosition1 * 1.5}px)` : `calc(${newValue1}% + ${newPosition1 * 1}px)` }}>
        <span>{prefix + numberWithCommas(lowerVal.toFixed(decimals)) + " " + suffix}</span>
      </RangeOutput>}
      <StyledRangeSlider
        id="upper"
        aria-label="upper value"
        aria-orientation="horizontal"
        aria-valuenow={upperVal}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        heightVal={300}
        ref={upperRange}
        min={min}
        max={max}
        step={snap ? step : 0}
        value={upperVal > max ? max : upperVal.toFixed(decimals)}
        onKeyDown={handleKeyPress}
        onFocus={() => {
          setUpperFocused(true);
        }}
        onBlur={() => {
          setUpperFocused(false);
        }}
        onInput={(e) => {
          const { valueAsNumber } = e.target as HTMLInputElement;
          setUpperVal(valueAsNumber);
        }}
        focused={upperFocused}
        wideTrack={wideTrack}
      />

      {/* LOWER RANGE */}
      {showTooltip && <RangeOutput
        focused={lowerFocused}
        wideTrack={wideTrack}
        style={{ left: wideTrack ? `calc(${newValue2}% + ${newPosition2 * 1.5}px)` : `calc(${newValue2}% + ${newPosition2 * 1}px)` }}>
        <span>{prefix + numberWithCommas(upperVal.toFixed(decimals)) + " " + suffix}</span>
      </RangeOutput>}
      <StyledRangeSlider
        id="lower"
        aria-label="lower value"
        aria-orientation="horizontal"
        aria-valuenow={lowerVal}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        heightVal={300}
        ref={lowerRange}
        min={min}
        max={max}
        step={snap ? step : 0}
        value={lowerVal > max ? max : lowerVal.toFixed(decimals)}
        onKeyDown={handleKeyPress}
        onFocus={() => {
          setLowerFocused(true);
        }}
        onBlur={() => {
          setLowerFocused(false);
        }}
        onInput={(e) => {
          const { valueAsNumber } = e.target as HTMLInputElement;
          setLowerVal(valueAsNumber);
        }}
        focused={lowerFocused}
        wideTrack={wideTrack}
      />

      {<Ticks ref={tickEl} wideTrack={wideTrack}>{labels}</Ticks>}
    </RangeWrap>
  );
};
