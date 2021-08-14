import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

let focusColor = "";

const whiteColor = "white";
const blackColor = "#999";

const Wrapper = styled.div<{ maxLabelLength?: number }>`
  padding-left: ${(p) => `${p?.maxLabelLength ?? 0 + 1}ch`};
`;

const RangeWrapWrap = styled.div<{ maxLabelLength: number, outputWidth: number, showTicks: boolean, heightVal: number }>`
  width: ${p => p.showTicks ?
    p.maxLabelLength + p.outputWidth + 125 + "px" :
    p.maxLabelLength + 60 + "px"
  };
`;

const RangeWrap = styled.div<{ heightVal: number, outputWidth: number, maxLabelLength: number, showTicks: boolean }>`
  width: ${p => p.heightVal + "px"};
  margin-left: ${p => (p.showTicks && `${p.maxLabelLength + 1}ch`)};
  transform: rotate(270deg);
  transform-origin: top left;
  margin-top: ${p => p.heightVal + "px"};
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
  margin-top: 3.75rem;
  margin-left: -1rem;
  span {
    writing-mode: vertical-lr;
    border: ${(p) =>
    p.focused ? `1px solid ${focusColor}` : `1px solid ${blackColor}`};
    border-radius: 5px;
    color: ${(p) => (p.focused ? whiteColor : blackColor)};
    background: ${(p) => (p.focused ? focusColor : whiteColor)};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5rem;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      border-top: ${(p) => (p.focused ? `12px solid ${focusColor}` : `0px`)};
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      bottom: 100%;
      margin-bottom: -2px;
      margin-left: 1px;
      transform: rotate(180deg);
    }
  }
`;

const StyledRangeSlider = styled.input.attrs({ type: "range" }) <{ focused: boolean, heightVal: number }>`
  cursor: pointer;
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
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: 3em;
    height: 3em;
    border: 1px solid ${blackColor};
    border-radius: 50%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
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
    background: ${(p) =>
    !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  ${focusColor} 0%,${focusColor} 35%,${whiteColor} 40%,${whiteColor} 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  ${whiteColor} 0%,${whiteColor} 35%,${focusColor} 40%,${focusColor} 100%)`};
  }
`;

const Progress = styled.div`
  z-index: -1;
  position: absolute;
  display: block;
  width: 100%;
  height: 15px;
  border-radius: 15px;
  top: 21px;
  box-shadow: inset 1px 1px 2px hsla(0, 0%, 0%, 0.25),
    inset 0px 0px 2px hsla(0, 0%, 0%, 0.25);
`;

const Ticks = styled.div`
  cursor: default;
  display: flex;
  justify-content: space-between;
  margin-right: 1.2rem;
  margin-left: 1.2rem;
  color: ${blackColor};
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
  height = 400
}: VerticalRangeSliderProps) => {
  const rangeEl = useRef<HTMLInputElement | null>(null)
  const outputEl = useRef<HTMLElement | null>(null)
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = useState(initialValue);
  const [newValue, setNewValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [outputWidth, setOutputWidth] = useState(0);
  const [maxLabelLength, setMaxLabelLength] = useState(0);
  const factor = (max - min) / 10;
  focusColor = primaryColor;
  blurColor = blurColor;
  const newPosition = Number(10 - newValue * 0.2);

  useEffect(() => {
    setNewValue(Number(((value - min) * 100) / (max - min)));
    const tickList = showTicks ? ticksEl.current?.children : null;
    let labelList = [];
    for (let i = 0; i < tickList!.length; i++) {
      const tickText = tickList![i]?.firstChild?.firstChild?.textContent?.length;
      showTicks &&
        showLabel &&
        tickText !== undefined && labelList.push(tickText);
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
          <RangeOutput
            ref={outputEl}
            focused={isFocused}
            className="disable-select"
            style={{ left: `calc(${newValue}% + (${newPosition / 10}rem))` }}
          >
            <span>
              {prefix +
                numberWithCommas(value.toFixed(decimals)) +
                " " +
                suffix}
            </span>
          </RangeOutput>
          <StyledRangeSlider
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
            className="disable-select"
          />
          <Progress
            style={{
              background: isFocused
                ? `-webkit-linear-gradient(left, ${focusColor} 0%,${focusColor} calc(${newValue}% + 
              (${newPosition / 10}rem)),${whiteColor} calc(${newValue}% + (${newPosition / 10
                }rem)),${whiteColor} 100%)`
                : `-webkit-linear-gradient(left, ${blurColor} 0%,${blurColor} calc(${newValue}% + 
              (${newPosition / 10}rem)),${whiteColor} calc(${newValue}% + (${newPosition / 10
                }rem)),${whiteColor} 100%)`,
            }}
          />
          {showTicks && <Ticks ref={ticksEl}>{marks}</Ticks>}
        </RangeWrap>
      </RangeWrapWrap>
    </Wrapper>
  );
};
