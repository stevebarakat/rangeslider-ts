import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

let focusColor = "";

// Styles

const whiteColor = "white";
const blackColor = "#999";

const RangeWrap = styled.div`
  position: relative;
  padding-top: 3.75rem;
  padding-bottom: 1.75rem;
  font-family: sans-serif;
  max-width: 100%;
  user-select: none;
`;

const RangeOutput = styled.output<{ focused: boolean }>`
  margin-top: -3.75rem;
  width: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  white-space: nowrap;
  span {
    border: ${(p) =>
    p.focused ? `1px solid ${focusColor}` : `1px solid ${blackColor}`};
    border-radius: 5px;
    color: ${(p) => (p.focused ? whiteColor : "var(--labelColor)")};
    background: ${(p) => (p.focused ? focusColor : whiteColor)};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5rem 0.75rem;
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

const Progress = styled.div<{ focused: boolean, thickTrack: boolean }>`
  position: absolute;
  border-radius: 100px;
  box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.12),
    inset 2px 2px 2px rgba(0, 0, 0, 0.24);
  height: ${p => p.thickTrack ? "15px" : "5px"};
  width: 100%;
  z-index: 0;
`;

const StyledRangeSlider = styled.input.attrs({ type: "range", role: "slider" }) <{
  focused: boolean,
  thickTrack: boolean,
}>`
  appearance: none;
  cursor: pointer;
  margin: 0;
  width: 100%;
  height: ${p => p.thickTrack ? "15px" : "5px"};
  position: absolute;
  z-index: 2;
  background: transparent;
  &:focus {
    outline: none;
  }
  padding-right: 2rem;

  &::-webkit-slider-thumb {
    position: relative;
    width: ${p => p.thickTrack ? "3em" : "1.25em"};
    height: ${p => p.thickTrack ? "3em" : "1.25em"};
    border-radius: 50%;
    border: ${p => p.thickTrack ? `1px solid ${blackColor}` : "none"};
    box-shadow: ${p => p.thickTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    cursor: grab;
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.thickTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
  };
    }

    &::-moz-range-thumb {
    position: relative;
    width: ${p => p.thickTrack ? "3em" : "1.25em"};
    height: ${p => p.thickTrack ? "3em" : "1.25em"};
    border-radius: 50%;
    border: ${p => p.thickTrack ? `1px solid ${blackColor}` : "none"};
    box-shadow: ${p => p.thickTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    cursor: grab;
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.thickTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`
      : focusColor
  };
    }
`;

const Ticks = styled.div<{ thickTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  margin-top: ${p => p.thickTrack ? "32px" : "12px"}
`;
const Tick = styled.div<{
  showTicks?: boolean;
  showLabel?: boolean;
  rotateLabel?: boolean;
  labelLength?: number | undefined;
}>`
  position: relative;
  width: 1px;
  height: ${(p) => (p.showTicks ? "5px" : "0")};
  background: ${blackColor};
  margin-bottom: ${(p) =>
    p.showLabel &&
    p.rotateLabel &&
    `${p.labelLength !== undefined && p.labelLength / 2}ch`};
  div {
    width: 0;
    color: var(--labelColor);
    transform-origin: top center;
    margin-top: 0.5rem;
    margin-left: ${(p) =>
    !p.rotateLabel && p.labelLength
      ? (p.labelLength / 2) * -1 + "ch"
      : "0.5rem"};
    transform: ${(p) => (p.rotateLabel ? "rotate(35deg)" : "rotate(0deg)")};
    white-space: nowrap;
  }
`;

function numberWithCommas(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface RangeSliderProps {
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
    For creating custom labels like so:<code> [
    { 0: "low" },
    { 50: "medium" },
    { 100: "high"}
  ]</code> 
  
  <i>Custom labels replace default labels!</i>
  */
  customLabels?: Array<Record<number, string>>;
  /**
    Show or hide labels.
  */
  showLabel?: boolean;
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
  blurColor?: string;
  /**
    The blur color. 
  */
  primaryColor?: string;
  /**
    The width of the range slider.
  */
  width?: number;
  /**
    The width of the range track.
  */
  thickTrack?: boolean;
  /**
The color of the labels.
*/
  labelColor?: string;
  /**
Show or hide tooltip.
*/
  showTooltip?: boolean;

}

export const RangeSlider = ({
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
  rotateLabel = false,
  blurColor = "grey",
  primaryColor = "black",
  width = 800,
  thickTrack = false,
  labelColor = "black",
  showTooltip = false,
}: RangeSliderProps) => {
  const rangeEl = useRef<HTMLInputElement | null>(null);
  const ticksEl = useRef(null);
  const [value, setValue] = useState(initialValue);
  const [newValue, setNewValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const factor = (max - min) / 10;
  const newPosition = 10 - newValue * 0.2;
  focusColor = primaryColor;

  useEffect(() => {
    setNewValue(Number(((value - min) * 100) / (max - min)));
  }, [value, min, max]);

  // Make sure min never exceds max
  if (min > max) {
    min = max;
  }
  // Make sure max is never less than min
  if (max < min) {
    max = min;
  }

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
        if (showLabel) {
          if (customTickText !== null) labelLength = customTickText[0]?.length;
          markers.push(
            <Tick
              key={i}
              style={{ "--labelColor": labelColor } as React.CSSProperties}
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

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
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
    <RangeWrap style={{ width: width }}>
      <Progress
        thickTrack={thickTrack}
        focused={isFocused}
        style={
          isFocused
            ? {
              background: `-webkit-linear-gradient(left, ${focusColor} 0%, ${focusColor} calc(${newValue}% + ${newPosition * 2
                }px), hsl(210, 52%, 93%) calc(${newValue}% + ${newPosition * 0.75
                }px), hsl(210, 52%, 93%) 100%)`
            }
            : thickTrack ? {
              background: `-webkit-linear-gradient(left, ${blurColor} 0%, ${blurColor} calc(${newValue}% + ${newPosition * 2
                }px), hsl(210, 52%, 93%) calc(${newValue}% + ${newPosition * 0.75
                }px), hsl(210, 52%, 93%) 100%)`
            } :
            {
              background: `-webkit-linear-gradient(left, ${focusColor} 0%, ${focusColor} calc(${newValue}% + ${newPosition * 2
                }px), hsl(210, 52%, 93%) calc(${newValue}% + ${newPosition * 0.75
                }px), hsl(210, 52%, 93%) 100%)`
            }
        }
      />

      {showTooltip && <RangeOutput
        focused={isFocused}
        style={{ left: thickTrack ? `calc(${newValue}% + ${newPosition * 2}px)` : `calc(${newValue}% + ${newPosition * 0.75}px)`, "--labelColor": labelColor } as React.CSSProperties}
      >
        <span>
          {prefix + numberWithCommas(value?.toFixed(decimals)) + suffix}
        </span>
      </RangeOutput>}
      <StyledRangeSlider
        aria-label="Basic Example"
        aria-orientation="horizontal"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        ref={rangeEl}
        min={min}
        max={max}
        step={snap ? step : 0}
        value={value > max ? max : value?.toFixed(decimals)}
        onInput={(e) => {
          const { valueAsNumber } = e.target as HTMLInputElement;
          rangeEl.current?.focus();
          setValue(valueAsNumber);
        }}
        onKeyDown={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        focused={isFocused}
        thickTrack={thickTrack}
      />
      <Ticks ref={ticksEl} thickTrack={thickTrack}>{marks}</Ticks>
    </RangeWrap>
  );
};
