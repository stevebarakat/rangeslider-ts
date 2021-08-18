import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

let newPosition1 = 0;
let newPosition2 = 0;
let focusColor = "";

// STYLES
const blackColor = "#999";
const whiteColor = "white";

const Wrapper = styled.div<{ maxLabelLength?: number }>`
  padding-left: ${(p) => `${p?.maxLabelLength ?? 0 + 1}ch`};
`;

const RangeWrap = styled.div<{ heightVal: number, outputWidth: number, maxLabelLength: number, showTicks: boolean }>`
  width: ${p => p.heightVal + "px"};
  margin-left: ${p => `${p.maxLabelLength + 1}ch`};
  transform: rotate(270deg);
  transform-origin: top left;
  margin-top: ${p => p.heightVal + "px"};
  left: 0;
  top: 0;
  font-family: sans-serif;
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
    border: ${(p) => p.focused ? `1px solid ${focusColor}` : `1px solid var(--labelColor)`};
    border-radius: 5px;
    color: ${(p) => (p.focused ? whiteColor : "var(--labelColor)")};
    background: ${(p) => (p.focused ? focusColor : whiteColor)};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5em;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `12px solid ${focusColor}` : `14px solid var(--labelColor)`};
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
      border-top: ${p => p.focused ? `12px solid ${focusColor}` : `12px solid ${whiteColor}`};
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
  border: 1px solid #AAA;
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
    /* border: ${p => p.wideTrack && !p.focused ? `1px solid ${blackColor}` : `1px solid ${focusColor}`}; */
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 20%,${focusColor} 25%,${focusColor} 100%)`
  }
  }
  
  &:focus::-webkit-slider-thumb {
    cursor: grabbing;
    box-shadow: ${p => !p.wideTrack && p.focused ? `0 0 8px 3px #FF0000` : `none`};
    background: ${p =>
    !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`};
  }
  
  &::-moz-range-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    height: 3em;
    width: 3em;
    border: 1px solid ${blackColor};
    border-radius: 50%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    appearance: none;
    z-index: 50;
    background: ${p =>
    p.focused
      ? `-moz-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-moz-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`};
  }

  &:focus::-moz-range-thumb {
    cursor: grabbing;
    background: ${p =>
    !p.focused
      ? `-moz-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-moz-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`};
  }
`;

const Ticks = styled.div<{ wideTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${p => p.wideTrack ? "20px" : "10px"};
  margin-top: ${p => p.wideTrack ? "32px" : "12px"};
  position: relative;
  top: -1.2em;
`;

const Tick = styled.div<{
  showTicks?: boolean;
  showLabel?: boolean;
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
  background: ${p => p.showTicks ? "var(--labelColor)" : "transparent"};
  label {
    color: var(--labelColor);
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
  height: number;
  /**
The width of the range track.
*/
  wideTrack?: boolean;
  /**
  The color of the labels.
  */
  labelColor?: string;
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
  showLabel = true,
  prefix = "",
  suffix = "",
  blurColor = "grey",
  primaryColor = "black",
  height = 400,
  wideTrack = true,
  labelColor = "#345345",
  showTooltip = false,
}: DualVerticalRangeSliderProps) => {
  const lowerRange = useRef<HTMLInputElement | null>(null);
  const upperRange = useRef<HTMLInputElement | null>(null);
  const outputEl = useRef<HTMLElement | null>(null);
  const tickEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [upperVal, setUpperVal] = useState(initialUpperValue);
  const [lowerVal, setLowerVal] = useState(initialLowerValue);
  const [newValue1, setNewValue1] = useState(0);
  const [newValue2, setNewValue2] = useState(0);
  const [upperFocused, setUpperFocused] = useState(true);
  const [lowerFocused, setLowerFocused] = useState(true);
  const [outputWidth, setOutputWidth] = useState(0);
  const [maxLabelLength, setMaxLabelLength] = useState(0);
  const factor = (max - min) / 5;
  newPosition1 = 10 - newValue1 * 0.2;
  newPosition2 = 10 - newValue2 * 0.2;
  focusColor = primaryColor;

  // Make sure min never exceds max
  if (min > max) {
    min = max;
  }
  // Make sure max is never less than min
  if (max < min) {
    max = min;
  }

  useEffect(() => {
    setNewValue1(Number(((lowerVal - min) * 100) / (max - min)));
    setNewValue2(Number(((upperVal - min) * 100) / (max - min)));
    if (showTicks) {
      const tickList = showTicks ? tickEl.current?.children : null;
      let labelList = [];
      for (let i = 0; i < tickList!.length; i++) {
        const tickText = tickList![i]?.firstChild?.firstChild?.textContent?.length;
        showLabel &&
          tickText !== undefined && labelList.push(tickText);
        if (!labelList) return;
        setMaxLabelLength(Math.max(...labelList));
      }
      if (!outputEl.current) return;
      setOutputWidth(outputEl.current?.clientHeight);
    }
  }, [min, max, lowerVal, upperVal, showLabel, showTicks]);

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
            maxLabelLength={maxLabelLength}
            showLabel={showLabel}
            showTicks={showTicks}
            style={{ "--labelColor": labelColor } as React.CSSProperties}
          >
            {showLabel && <label htmlFor={tickText}>{customTickText}</label>}

          </Tick>
        );
      }
    }
  } else {
    if (step > 0) {
      for (let i = min; i <= max; i += step) {
        let tickText = prefix + numberWithCommas(i.toFixed(decimals)) + suffix;
        const labelLength: number = tickText.toString().length;
        markers.push(
          Tick && (
            <Tick
              key={i}
              maxLabelLength={maxLabelLength}
              labelLength={labelLength}
              showLabel={showLabel}
              showTicks={showTicks}
              style={{ "--labelColor": labelColor } as React.CSSProperties}
            >
              {showLabel && <label htmlFor={tickText}>{tickText}</label>}

            </Tick>
          )
        );
      }
    }
  }

  const marks = markers.map((marker) => marker);

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
        case "Escape": //Esc
          // rangeEl.current.blur();
          return;
        case "ArrowLeft": //Left
          upper && setUpperVal(upperVal - factor);
          !upper && setLowerVal(lowerVal - factor);
          return;
        case "ArrowDown": //Down
        upper && setUpperVal(upperVal - factor);
        !upper && setLowerVal(lowerVal - factor);          return;
        case "ArrowUp": //Up
        upper && setUpperVal(upperVal + factor);
        !upper && setLowerVal(lowerVal + factor);          return;
        case "ArrowRight": //Right
        upper && setUpperVal(upperVal + factor);
        !upper && setLowerVal(lowerVal + factor);          return;
        default:
          return;
      }
    }
  }


  return (
    <Wrapper maxLabelLength={maxLabelLength}>
      <RangeWrap
        outputWidth={outputWidth}
        showTicks={showTicks}
        heightVal={height}
        maxLabelLength={maxLabelLength}
      >
        <Progress
          wideTrack={wideTrack}
          focused={upperFocused || lowerFocused}
          style={{
            background: !wideTrack ?
              `-webkit-linear-gradient(left,  
              ${whiteColor} ${`calc(${newValue2}% + ${newPosition2}px)`},
              ${focusColor} ${`calc(${newValue2}% + ${newPosition2}px)`},
              ${focusColor} ${`calc(${newValue1}% + ${newPosition1}px)`},
              ${whiteColor} ${`calc(${newValue1}% + ${newPosition1}px)`})`
              :
              upperFocused || lowerFocused ? `-webkit-linear-gradient(left,  
                ${whiteColor} ${`calc(${newValue2}% + ${newPosition2}px)`},
                ${focusColor} ${`calc(${newValue2}% + ${newPosition2}px)`},
                ${focusColor} ${`calc(${newValue1}% + ${newPosition1}px)`},
                ${whiteColor} ${`calc(${newValue1}% + ${newPosition1}px)`})`
                :
                `-webkit-linear-gradient(left,  
                  ${whiteColor} ${`calc(${newValue2}% + ${newPosition2}px)`},
                  ${blurColor} ${`calc(${newValue2}% + ${newPosition2}px)`},
                  ${blurColor} ${`calc(${newValue1}% + ${newPosition1}px)`},
                  ${whiteColor} ${`calc(${newValue1}% + ${newPosition1}px)`})`
          }}
        />

        {/* UPPER RANGE */}
        {showTooltip && <RangeOutput
          ref={outputEl}
          focused={upperFocused}
          wideTrack={wideTrack}
          style={{ left: wideTrack ? `calc(${newValue1}% + ${newPosition1 * 2}px)` : `calc(${newValue1}% + ${newPosition1 * 1}px)`, "--labelColor": labelColor } as React.CSSProperties}>
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
          style={{ left: wideTrack ? `calc(${newValue2}% + ${newPosition2 * 2}px)` : `calc(${newValue2}% + ${newPosition2 * 1}px)`, "--labelColor": labelColor } as React.CSSProperties}>
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

        {<Ticks ref={tickEl} wideTrack={wideTrack}>{marks}</Ticks>}
      </RangeWrap>
    </Wrapper>
  );
};
