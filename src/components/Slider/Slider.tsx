import React from "react";
import styled from "styled-components";

const StyledSlider = styled.input.attrs({ type: "range" })`
  width: 300px;
  appearance: none;
  position: absolute;
  max-width: 100%;
  border-radius: 15px;
  height: 8px;
  background: var(--color-secondary);
  margin: 0;
  &::-webkit-slider-thumb {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    appearance: none;
    z-index: 50;
    background: var(--color-primary);
    border: 5px solid var(--color-secondary);
  }
`;

const Slider = ({ style, ...rest }) => {
  return (
    <div>
      <StyledSlider
        style={{ boxShadow: "0 0 1px 10px var(--color-primary)", ...style }}
        {...rest}
      />
    </div>
  );
};

export default Slider;
