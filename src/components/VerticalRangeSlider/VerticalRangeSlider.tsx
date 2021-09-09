import { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

const RangeWrap = styled.div<{
  height: number;
  showTicks: boolean;
}>`
  display: grid;
  grid-template-rows: repeat(3, auto);
  width: ${(p) => p.height + "px"};
  transform: rotate(270deg);
  transform-origin: top left;
  margin-top: ${(p) => p.height + "px"};
  font-family: inherit;
  border: 1px dotted red;
`;

const RangeOutput = styled.output<{ focused: boolean, wideTrack: boolean }>`
  user-select: none;
  position: relative;
  display: flex;
  justify-content: flex-start;
  margin-top: ${(p) => (p.wideTrack ? "2.5em" : "2em")};
  margin-left: -1rem;
  span {
    writing-mode: vertical-lr;
    border: ${(p) =>
    p.focused
      ? `1px solid var(--color-primary)`
      : `1px solid var(--color-darkgray)`};
    border-radius: 5px;
    font-weight: ${(p) => (p.focused ? "bold" : "normal")};
    color: ${(p) =>
    p.focused ? "var(--color-white)" : "var(--color-darkgray)"};
    background: ${(p) =>
    p.focused ? "var(--color-primary)" : "var(--color-white)"};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5em;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `12px solid var(--color-primary)` : `14px solid var(--color-darkgray)`};
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
      border-top: ${p => p.focused ? `12px solid var(--color-primary)` : `12px solid ${"var(--color-white)"}`};
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
  height: ${(p) => (p.wideTrack ? "12px" : "5px")};
  width: 100%;
  z-index: 0;
  border-bottom: ${p => p.wideTrack ? "1px solid var(--color-transparent-gray)" : "none"};
  box-shadow: ${p => p.wideTrack ? "inset 1px 1px 1px 0.5px var(--color-transparent-gray)" : "none"}
  `;

const StyledRangeSlider = styled.input.attrs({
  type: "range",
  role: "slider",
}) <{ focused: boolean; wideTrack: boolean; height: number }>`
  cursor: pointer;
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
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "36px" : "20px"};
    height: ${p => p.wideTrack ? "36px" : "20px"};
    top: ${p => p.wideTrack ? "0" : "-1.5px"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? p.focused ? "1px solid var(--color-primary)" : `1px solid var(--color-lightgray)` : "none"};
    box-shadow: -1px 0 5px 0 rgba(0, 0, 0, 0.25);
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
    width: ${p => p.wideTrack ? "3em" : "1.5em"};
    height: ${p => p.wideTrack ? "3em" : "1.5em"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? `1px solid var(--color-darkgray)` : "none"};
    box-shadow: ${p => p.wideTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,${"var(--color-white)"} 40%,${"var(--color-white)"} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${"var(--color-white)"} 0%,${"var(--color-white)"} 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
  }
  }
  
`;

const Ticks = styled.div<{ wideTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: ${(p) => (p.wideTrack ? "10.5px" : "5px 2px")};
`;

const Tick = styled.div<{
  showTicks?: boolean;
  showLabels?: boolean;
  focused?: boolean;
}>`
  align-self: center;
  width: 1px;
  height: 5px;
  background: ${(p) => (p.showTicks ? "var(--color-darkgray)" : "transparent")};
`;

const Label = styled.div`
  display: grid;
  grid-gap: 3px;
  grid-template-columns: auto 1fr;
  color: var(--color-darkgray);
  writing-mode: vertical-lr;
  margin-bottom: 0.5rem;
  white-space: nowrap;
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

export const VerticalRangeSlider = ({
  initialValue = 50,
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
  wideTrack = false,
  showTooltip = false,
}: VerticalRangeSliderProps) => {
  const rangeEl = useRef<HTMLInputElement | null>(null);
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = useState(initialValue);
  const [newValue, setNewValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const factor = (max - min) / 5;
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
    if (showTicks) {
      const tickList = ticksEl.current?.children;
      let labelList = [];
      for (let i = 0; i < tickList!.length; i++) {
        const tickText = tickList![i]?.firstChild?.firstChild?.textContent
          ?.length;
        showLabels &&
          tickText !== undefined &&
          labelList.push(tickText);
      }
    }
  }, [min, max, value, showLabels, showTicks]);

  // For collecting tick marks
  function createLabels() {
    if (step > 0) {
      // creates an array of numbers from 'min' to 'max' with 'step' as interval
      const numbers = Array.from(Array((max - min) / step + 1)).map(
        (_, i) => min + step * i
      );
      // create tick mark for every element in the numbers array
      return numbers.map((n) => (
        <div key={n}>
          {
            // if there are custom labels, show them!
            customLabels?.length > 0
              ? showLabels &&
              customLabels.map((label) => {
                return (
                  n === Number(Object.keys(label)[0]) && (
                    <Label key={n}>
                      <label htmlFor={n.toString()}>{Object.values(label)}</label>
                      <Tick showLabels={showLabels} showTicks={showTicks} />
                    </Label>
                  )
                );
              })
              : // if there are not custom labels, show the default labels (n)
              showLabels && (
                <Label key={n}>
                  <label htmlFor={n.toString()}>{prefix + numberWithCommas(n.toFixed(decimals)) + suffix}</label>
                  <Tick showLabels={showLabels} showTicks={showTicks} />
                </Label>
              )
          }
        </div>
      ));
    }
  }
  const labels = createLabels();

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
    <RangeWrap
      showTicks={showTicks}
      height={height}
    >
      <Ticks ref={ticksEl} wideTrack={wideTrack}>
        {labels}
      </Ticks>
      <div>
        <Progress
          wideTrack={wideTrack}
          focused={isFocused}
          style={
            !isFocused && wideTrack
              ? {
                background: `-webkit-linear-gradient(left, var(--color-secondary) 0%, var(--color-secondary) calc(${newValue}% + ${newPosition * 2
                  }px), var(--color-white) calc(${newValue}% + ${newPosition * 0.75
                  }px), var(--color-white) 100%)`,
              }
              : {
                background: `-webkit-linear-gradient(left, var(--color-primary) 0%, var(--color-primary) calc(${newValue}% + ${newPosition * 2
                  }px), var(--color-secondary) calc(${newValue}% + ${newPosition * 0.75
                  }px), var(--color-secondary) 100%)`,
              }
          }
        />
        <StyledRangeSlider
          aria-label="Basic Example"
          aria-orientation="horizontal"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={0}
          height={300}
          ref={rangeEl}
          min={min}
          max={max}
          step={snap ? step : 0}
          value={value > max ? max : value.toFixed(decimals)}
          onInput={(e) => {
            setValue(e.currentTarget.valueAsNumber);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyPress}
          focused={isFocused}
          wideTrack={wideTrack}
        />
      </div>
      {showTooltip && (
        <RangeOutput
          focused={isFocused}
          wideTrack={wideTrack}
          style={{
            left: wideTrack
              ? `calc(${newValue}% + ${newPosition * 1.75}px)`
              : `calc(${newValue}% + ${newPosition}px)`,
          }}
        >
          <span>
            {prefix + numberWithCommas(value.toFixed(decimals)) + " " + suffix}
          </span>
        </RangeOutput>
      )}
    </RangeWrap>
  );
};
