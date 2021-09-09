import { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

let newPosition1 = 0;
let newPosition2 = 0;

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
  const outputEl = useRef<HTMLElement | null>(null);
  const tickEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [upperVal, setUpperVal] = useState(initialUpperValue);
  const [lowerVal, setLowerVal] = useState(initialLowerValue);
  const [newValue1, setNewValue1] = useState(0);
  const [newValue2, setNewValue2] = useState(0);
  const [upperFocused, setUpperFocused] = useState(false);
  const [lowerFocused, setLowerFocused] = useState(false);
  const factor = (max - min) / 5;
  const focused = upperFocused || lowerFocused;
  newPosition1 = 0 - newValue1 * 0.2;
  newPosition2 = 10 - newValue2 * 0.2;

  useLayoutEffect(() => {
    setNewValue1(Number(((lowerVal - min) * 100) / (max - min)));
    setNewValue2(Number(((upperVal - min) * 100) / (max - min)));
    if (showTicks) {
      const tickList = tickEl.current?.children;
      let labelList = [];
      for (let i = 0; i < tickList!.length; i++) {
        const tickText = tickList![i]?.firstChild?.firstChild?.textContent
          ?.length;
        showLabels &&
          tickText !== undefined &&
          labelList.push(tickText);
      }
    }
  }, [min, max, lowerVal, upperVal, showLabels, showTicks]);

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
      height={height}
    >
      <Ticks ref={tickEl} wideTrack={wideTrack}>
        {labels}
      </Ticks>
      <div>
        <Progress
          wideTrack={wideTrack}
          focused={focused}
          style={
            !focused && wideTrack ? {
              background: `-webkit-linear-gradient(left,  
                var(--color-white) ${`calc(${newValue1}% + ${newPosition1}px)`},
                var(--color-primary) ${`calc(${newValue1}% + ${newPosition1}px)`},
                var(--color-primary) ${`calc(${newValue2}% + ${newPosition2}px)`},
                var(--color-white) ${`calc(${newValue2}% + ${newPosition2}px)`})`
            } :
              {
                background: `-webkit-linear-gradient(left,  
                  var(--color-secondary) ${`calc(${newValue1}% + ${newPosition1}px)`},
                  var(--color-primary) ${`calc(${newValue1}% + ${newPosition1}px)`},
                  var(--color-primary) ${`calc(${newValue2}% + ${newPosition2}px)`},
                  var(--color-secondary) ${`calc(${newValue2}% + ${newPosition2}px)`})`
              }
          }
        />
        <div style={{ display: "flex" }}>

          {/* UPPER RANGE */}
          <StyledRangeSlider
            id="upper"
            aria-label="upper value"
            aria-orientation="horizontal"
            aria-valuenow={upperVal}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={0}
            height={300}
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
        </div>



        <StyledRangeSlider
          id="lower"
          aria-label="lower value"
          aria-orientation="horizontal"
          aria-valuenow={lowerVal}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={0}
          height={300}
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

      </div>

      {/* TOOLTIPS */}
      <div style={{ display: "flex" }}>
        {showTooltip && (
          <RangeOutput
            ref={outputEl}
            focused={upperFocused}
            wideTrack={wideTrack}
            style={{
              left: wideTrack
                ? `calc(${newValue2}% + ${newPosition2 * 1.75}px)`
                : `calc(${newValue2}% + ${newPosition2}px)`,
            }}
          >
            <span>
              {prefix + numberWithCommas(upperVal.toFixed(decimals)) + " " + suffix}
            </span>
          </RangeOutput>
        )}
        {/* LOWER RANGE */}
        {showTooltip && (
          <RangeOutput
            ref={outputEl}
            focused={lowerFocused}
            wideTrack={wideTrack}
            style={{
              left: wideTrack
                ? `calc(${newValue1}% + ${newPosition1 * 1.75}px)`
                : `calc(${newValue1}% + ${newPosition1}px)`,
            }}
          >
            <span>
              {prefix + numberWithCommas(lowerVal.toFixed(decimals)) + " " + suffix}
            </span>
          </RangeOutput>
        )}
      </div>


    </RangeWrap>
  );
};
