import { useState, useRef } from "react";
import styled from "styled-components";

interface InputTimeProps {
  /**
   * Prevents user from changing the value.
   */
  readOnly?: boolean;
  /* 
   * A string that provides a brief hint to the user as to what kind of information is expected in the field. It should be a word or short phrase that provides a hint as to the expected type of data, rather than an explanation or prompt. The text must not include carriage returns or line feeds. So for example if a field is expected to capture a user's first name, and its label is "First Name", a suitable placeholder might be "e.g. Mustafa". 
   */
  placeholder?: string;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * Minimum time value?
   */
  min?: string;
  /**
   * Maximum time value?
   */
  max?: string;
  /**
   * How large should the interval be?
   */
  step?: number;
  /**
   * How large should the number be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const Wrapper = styled.div`
  display: flex;
  font-size: 1rem;
`;

const StyledTimeInput = styled.input.attrs({ type: "time" })`
  /* width: ${(p) => p.width + "ch"}; */
  padding: 1rem;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Button = styled.button`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  border: 1px solid #565656;
  background: white;
`;

/**
 * Docs
 */
export const InputTime = ({
  readOnly = false,
  placeholder = "0",
  min = "06:00",
  max = "16:00",
  step = 60,
  size = "medium",
  backgroundColor = "#565656",
  label = "Amount: ",
  ...props
}: InputTimeProps) => {
  const inputEl = useRef<HTMLInputElement | null>(null);

  return (
    <Wrapper>
      <label htmlFor="number">{label}</label>
      <Button
        tabIndex={0}
        onClick={() => {
          if (!inputEl.current) return;
          inputEl.current.stepDown();
        }}
      >
        -
      </Button>
      <StyledTimeInput
        ref={inputEl}
        readOnly={readOnly}
        placeholder={min.toString()}
        min={min}
        max={max}
        step={step}
        {...props}
        tabIndex={0}
        onChange={(e) => {
          const { valueAsDate } = e.target as HTMLInputElement;
          if (!valueAsDate) return;
          if (valueAsDate >= new Date(max)) {
            e.currentTarget.valueAsDate = new Date(max);
          } else if (valueAsDate <= new Date(min)) {
            e.currentTarget.valueAsDate = new Date(min);
          }
        }}
      />
      <Button
        tabIndex={0}
        onClick={() => {
          if (!inputEl.current) return;
          inputEl.current.stepUp();
        }}
      >
        +
      </Button>
    </Wrapper>
  );
};

export default InputTime;
