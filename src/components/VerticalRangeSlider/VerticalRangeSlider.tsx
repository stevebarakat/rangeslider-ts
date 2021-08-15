import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

let focusColor = "";

const whiteColor = "white";
const blackColor = "#999";

const Wrapper = styled.div<{ maxLabelLength?: number }>`
  padding-left: ${(p) => `${p?.maxLabelLength ?? 0 + 1}ch`};
`;

const RangeWrapWrap = styled.div<{
  maxLabelLength: number;
  outputWidth: number;
  showTicks: boolean;
  heightVal: number;
}>`
  width: ${(p) =>
    p.showTicks
      ? p.maxLabelLength + p.outputWidth + 125 + "px"
      : p.maxLabelLength + 60 + "px"};
`;

const RangeWrap = styled.div<{
  heightVal: number;
  outputWidth: number;
  maxLabelLength: number;
  showTicks: boolean;
}>`
  width: ${(p) => p.heightVal + "px"};
  margin-left: ${(p) => p.showTicks && `${p.maxLabelLength + 1}ch`};
  transform: rotate(270deg);
  transform-origin: top left;
  margin-top: ${(p) => p.heightVal + "px"};
  left: 0;
  top: 0;
  font-family: sans-serif;
`;

const RangeOutput = styled.output<{ focused: boolean }>`
  width: 0;
  user-select: none;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  margin-top: 1.5rem;
  margin-left: -1rem;
  span {
    writing-mode: vertical-lr;
    border: ${(p) =>
    p.focused ? `1px solid ${focusColor}` : `1px solid ${blackColor}`};
    border-radius: 5px;
    color: ${(p) => (p.focused ? whiteColor : blackColor)};
    background: ${(p) => (p.focused ? focusColor : whiteColor)};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5em;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `12px solid ${focusColor}` : `14px solid ${blackColor}`};
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

const Progress = styled.div<{ focused: boolean; wideTrack: boolean }>`
  position: absolute;
  border-radius: 100px;
  box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.12),
    inset 2px 2px 2px rgba(0, 0, 0, 0.24);
  height: ${(p) => (p.wideTrack ? "15px" : "5px")};
  width: 100%;
  z-index: 0;
`;

const StyledRangeSlider = styled.input.attrs({
  type: "range",
  role: "slider",
}) <{ focused: boolean; wideTrack: boolean; heightVal: number }>`
  cursor: pointer;
  appearance: none;
  position: absolute;
  width: 100%;
  height: ${p => p.wideTrack ? "15px" : "5px"};
  border-radius: 15px;
  background: transparent;
  margin: 0;
  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "3em" : "1.25em"};
    height: ${p => p.wideTrack ? "3em" : "1.25em"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? `1px solid ${blackColor}` : "none"};
    box-shadow: ${p => p.wideTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
  }
  }
  
  &::-moz-range-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "3em" : "1.25em"};
    height: ${p => p.wideTrack ? "3em" : "1.25em"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? `1px solid ${blackColor}` : "none"};
    box-shadow: ${p => p.wideTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
  }
  }
  
`;

// const Ticks = styled.div<{ wideTrack: boolean }>`
//   display: flex;
//   justify-content: space-between;
//   margin-right: 1.2rem;
//   margin-left: 1.2rem;
// `;

const Ticks = styled.div<{ wideTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${p => p.wideTrack ? "20px" : "7px"};
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
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: flex-end;
  width: 1px;
  background: ${blackColor};
  height: 5px;
  div {
    writing-mode: vertical-rl;
    margin-left: 0.65em;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${(p) => (p.focused ? `12px solid ${focusColor}` : `0px`)};
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      margin-top: -1px;
    }
  }
`;

function numberWithCommas(x: string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface VerticalRangeSliderProps {
  /**
    The initial value.
  */
  initialValue: number;
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

export const VerticalRangeSlider = ({
  initialValue = 50,
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
  blurColor = "#FF0000",
  primaryColor = "black",
  height = 400,
  wideTrack = false,
  labelColor = "black",
  showTooltip = false,
}: VerticalRangeSliderProps) => {
  const rangeEl = useRef<HTMLInputElement | null>(null);
  const outputEl = useRef<HTMLElement | null>(null);
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = useState(initialValue);
  const [newValue, setNewValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [outputWidth, setOutputWidth] = useState(0);
  const [maxLabelLength, setMaxLabelLength] = useState(0);
  const factor = (max - min) / 10;
  const newPosition = 10 - newValue * 0.2;
  focusColor = primaryColor;

  useEffect(() => {
    setNewValue(Number(((value - min) * 100) / (max - min)));
    const tickList = showTicks ? ticksEl.current?.children : null;
    let labelList = [];
    for (let i = 0; i < tickList!.length; i++) {
      const tickText = tickList![i]?.firstChild?.firstChild?.textContent
        ?.length;
      showTicks &&
        showLabel &&
        tickText !== undefined &&
        labelList.push(tickText);
      console.log(labelList);
    }
    if (!labelList) return;
    setMaxLabelLength(Math.max(...labelList));
    if (!outputEl.current) return;
    setOutputWidth(outputEl.current?.clientHeight);
  }, [min, max, value, showLabel, showTicks]);

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
            showLabel={showLabel}
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

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    // Check if modifier key is pressed
    const cmd = e.metaKey;
    const ctrl = e.ctrlKey;

    switch (e.code) {
      case "Escape": //Esc
        // rangeEl.current.blur();
        return;
      case "ArrowLeft": //Left
        (cmd || ctrl) && setValue(value - factor);
        return;
      case "ArrowDown": //Down
        (cmd || ctrl) && setValue(value - factor);
        return;
      case "ArrowUp": //Up
        (cmd || ctrl) && setValue(value >= max ? max : value + factor);
        return;
      case "ArrowRight": //Right
        (cmd || ctrl) && setValue(value >= max ? max : value + factor);
        return;
      default:
        return;
    }
  }

  return (
    <Wrapper maxLabelLength={maxLabelLength}>
      <RangeWrapWrap
        outputWidth={outputWidth}
        showTicks={showTicks}
        heightVal={height}
        maxLabelLength={maxLabelLength}
      >
        <RangeWrap
          outputWidth={outputWidth}
          showTicks={showTicks}
          heightVal={height}
          maxLabelLength={maxLabelLength}
        >
          <Progress
        wideTrack={wideTrack}
        focused={isFocused}
        style={
          isFocused
            ? {
              background: `-webkit-linear-gradient(left, ${focusColor} 0%, ${focusColor} calc(${newValue}% + ${newPosition * 2
                }px), ${whiteColor} calc(${newValue}% + ${newPosition * 0.75
                }px), ${whiteColor} 100%)`
            }
            : wideTrack ? {
              background: `-webkit-linear-gradient(left, ${blurColor} 0%, ${blurColor} calc(${newValue}% + ${newPosition * 2
                }px), ${whiteColor} calc(${newValue}% + ${newPosition * 0.75
                }px), ${whiteColor} 100%)`
            } :
              {
                background: `-webkit-linear-gradient(left, ${focusColor} 0%, ${focusColor} calc(${newValue}% + ${newPosition * 2
                  }px), ${whiteColor} calc(${newValue}% + ${newPosition * 0.75
                  }px), ${whiteColor} 100%)`
              }
        }
      />
          <RangeOutput
            ref={outputEl}
            focused={isFocused}
            className="disable-select"
            style={{ left: wideTrack ? `calc(${newValue}% + ${newPosition * 2}px)` : `calc(${newValue}% + ${newPosition * 0.75}px)`, "--labelColor": labelColor } as React.CSSProperties}
            >
            <span>
              {prefix +
                numberWithCommas(value.toFixed(decimals)) +
                " " +
                suffix}
            </span>
          </RangeOutput>
          <StyledRangeSlider
            aria-label="Basic Example"
            aria-orientation="horizontal"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={0}
            heightVal={300}
            ref={rangeEl}
            min={min}
            max={max}
            step={snap ? step : 0}
            value={value > max ? max : value.toFixed(decimals)}
            onClick={() => rangeEl.current?.focus()}
            onInput={(e) => {
              const { valueAsNumber } = e.target as HTMLInputElement;
              setValue(valueAsNumber);
            }}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            focused={isFocused}
            wideTrack={wideTrack}
          />
          <Ticks ref={ticksEl} wideTrack={wideTrack}>{marks}</Ticks>
        </RangeWrap>
      </RangeWrapWrap>
    </Wrapper>
  );
};
