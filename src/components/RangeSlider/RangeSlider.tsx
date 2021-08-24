import React, { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";


// Styles

const Wrapper = styled.div<{ rotateLabel: boolean, lastLabelLength: any, firstLabelLength: any }>`
  padding-left: ${p => p.rotateLabel ? 0 : p.firstLabelLength / 3.5 + "ch"};
  padding-right: ${p => p.rotateLabel ? p.lastLabelLength / 1.75 + "ch" : p.lastLabelLength / 3.5 + "ch"};
`;

const RangeWrap = styled.div<{ showTooltip: boolean, showLabel: boolean }>`
  position: relative;
  padding-top: ${p => p.showTooltip ? "3.75rem" : ""};
  padding-bottom: ${p => p.showLabel ? "1.75rem" : 0};
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
    p.focused ? `1px solid var(--color-primary)` : `1px solid var(--color-darkgray)`};
    border-radius: 5px;
    font-weight: ${p => p.focused && "bold"};
    color: ${(p) => (p.focused ? "var(--color-white)" : "var(--color-darkgray)")};
    background: ${(p) => (p.focused ? "var(--color-primary)" : "white")};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5rem 0.75rem;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `14px solid var(--color-primary)` : `14px solid var(--color-darkgray)`};
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
      border-top: ${p => p.focused ? `14px solid var(--color-primary)` : `12px solid white`};
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
  height: ${p => p.wideTrack ? "12px" : "7px"};
  width: 100%;
  z-index: 0;
  border-bottom: ${p => p.wideTrack ? "1px solid var(--color-transparent-gray)" : "none"};
  box-shadow: ${p => p.wideTrack ? "inset 1px 1px 1px 0.5px var(--color-transparent-gray)" : "none"};
`;

const StyledRangeSlider = styled.input.attrs({
  type: "range",
  role: "slider",
}) <{ focused: boolean, wideTrack: boolean }>`
  cursor: pointer;
  appearance: none;
  position: absolute;
  width: 100%;
  height: ${p => p.wideTrack ? "12px" : "9px"};
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
    /* top: ${p => p.wideTrack ? "-1.5px" : "-1.5px"}; */
    top: -1.5px;
    width: ${p => p.wideTrack ? "32px" : "20px"};
    height: ${p => p.wideTrack ? "32px" : "20px"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? p.focused ? "none" : `1px solid var(--color-transparent-gray)` : "none"};
    border-bottom: none;
    box-shadow: 0 1px 1px 0.5px var(--color-transparent-gray);
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover, var(--color-primary) 0%, var(--color-primary) 35%, var(--color-white) 40%,var(--color-white) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover, var(--color-white) 0%, var(--color-white) 35%, var(--color-primary) 40%, var(--color-primary) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover, var(--color-white) 0%, var(--color-white) 20%, var(--color-primary) 25%, var(--color-primary) 100%)`
  }
  }
  
  &:focus::-webkit-slider-thumb {
    cursor: grabbing;
    background: ${p =>
    !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,var(--color-white) 40%,var(--color-white) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  var(--color-white) 0%,var(--color-white) 35%,var(--color-primary) 40%,var(--color-primary) 100%)`};
  }
  
  &::-moz-range-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "3em" : "1.5em"};
    height: ${p => p.wideTrack ? "3em" : "1.5em"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? "1px solid var(--color-gray700)" : "none"};
    box-shadow: ${p => p.wideTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,var(--color-white) 40%,var(--color-white) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  var(--color-white) 0%,var(--color-white) 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  var(--color-white) 0%,var(--color-white) 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
  }
  }
  
`;

const Ticks = styled.div<{ wideTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${p => p.wideTrack ? "10px 15px" : "5px 10px"};
`
const Tick = styled.div<{
  showTicks?: boolean;
  showLabel?: boolean;
  rotateLabel?: boolean;
  labelLength?: number | undefined;
}>`
  position: relative;
  width: 1px;
  height: ${(p) => (p.showTicks ? "5px" : "0")};
  background: var(--color-darkgray);
  margin-top: 1rem;
  margin-bottom: ${(p) =>
    p.showLabel &&
    p.rotateLabel &&
    `${p.labelLength !== undefined && p.labelLength / 2}ch`};
  label {
    display: block;
    width: 0;
    color: var(--color-darkgray);
    transform-origin: top center;
    margin-top: 0.5rem;
    margin-left: ${(p) =>
    !p.rotateLabel && p.labelLength
      ? (p.labelLength / 2) * -0.5 + "em"
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
  min?: number;
  /**
    The maximum value. 
  */
  max?: number;
  /**
    The invterval between ticks.
  */
  step?: number;
  /**
    Snap to ticks or scroll smoothly.
   */
  snap?: boolean;
  /**
    Show or hide tick marks.
 */
  showTicks?: boolean;
  /**
    Show or hide labels.
  */
  showLabel?: boolean;
  /**
    Show or hide tooltip.
  */
  showTooltip?: boolean;
  /**
    This rotates the label by 45 degrees allowing for more labels and / or longer labels.
 */
  rotateLabel?: boolean;
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
    Optional text displayed before value. 
   */
  prefix?: string;
  /**
    Optional text displayed after value.
   */
  suffix?: string;
  /**
    The amount of decimal points to be rounded to. 
  */
  decimals?: number;
  /**
    The width of the range track.
   */
  wideTrack?: boolean;
  /**
    The width of the range slider.
  */
  width?: number;
}

export const RangeSlider = ({
  initialValue = 50,
  min = 0,
  max = 100,
  decimals,
  step,
  showTicks,
  snap,
  customLabels,
  showLabel,
  prefix = "",
  suffix = "",
  rotateLabel,
  width,
  wideTrack,
  showTooltip,
}: RangeSliderProps) => {
  const rangeEl = useRef<HTMLInputElement | null>(null);
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = useState(initialValue);
  const [newValue, setNewValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const factor = (max - min) / 10;
  const newPosition = 10 - newValue * 0.2;

  // Make sure min never exceds max
  if (min > max) {
    min = max;
  }
  // Make sure max is never less than min
  if (max < min) {
    max = min;
  }

  useLayoutEffect(() => {
    setNewValue(Number(((value - min) * 100) / (max - min)));
  }, [value, min, max]);

  // For collecting tick marks
  let markers = [];
  if (customLabels?.length > 0) {
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
        if (showLabel) {
          if (customTickText !== null) labelLength = customTickText[0]?.length;
          markers.push(
            <Tick
              key={i}
              labelLength={labelLength}
              showLabel={showLabel}
              rotateLabel={rotateLabel}
              showTicks={showTicks}
            >
              {showLabel && <label htmlFor={tickText}>{customTickText}</label>}
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
        markers.push(
          Tick && (
            <Tick
              key={i}
              labelLength={labelLength}
              rotateLabel={rotateLabel}
              showLabel={showLabel}
              showTicks={showTicks}
            >
              {showLabel && <label htmlFor={tickText}>{tickText}</label>}
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
    <Wrapper
      rotateLabel={rotateLabel}
      firstLabelLength={showLabel && (step > 0) && ticksEl?.current?.firstChild?.firstChild?.textContent?.length}
      lastLabelLength={showLabel && (step > 0) && ticksEl?.current?.lastChild?.firstChild?.textContent?.length}
    >
      <RangeWrap showTooltip={showTooltip} showLabel={showLabel} style={{ width: width }}>
        <Progress
          wideTrack={wideTrack}
          focused={isFocused}
          style={
            !isFocused && wideTrack ? {
              background: `-webkit-linear-gradient(left, var(--color-secondary) 0%, var(--color-secondary) calc(${newValue}% + ${newPosition * 2
                }px), var(--color-white) calc(${newValue}% + ${newPosition * 0.75
                }px), var(--color-white) 100%)`
            } :
              {
                background: `-webkit-linear-gradient(left, var(--color-primary) 0%, var(--color-primary) calc(${newValue}% + ${newPosition * 2
                  }px), var(--color-secondary) calc(${newValue}% + ${newPosition * 0.75
                  }px), var(--color-secondary) 100%)`
              }
          }
        />

        {showTooltip && <RangeOutput
          focused={isFocused}
          style={{ left: wideTrack ? `calc(${newValue}% + ${newPosition * 1.75}px)` : `calc(${newValue}% + ${newPosition * 1}px)` } as React.CSSProperties}
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
          wideTrack={wideTrack}
        />
        <Ticks ref={ticksEl} wideTrack={wideTrack}>{marks}</Ticks>
      </RangeWrap>
    </Wrapper>
  );
};
