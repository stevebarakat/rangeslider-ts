import { useState, useRef } from "react";
import styled from "styled-components";

interface InputNumberProps {
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
   * Minimum number value?
   */
  min?: number;
  /**
   * Maximum number value?
   */
  max?: number;
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

const StyledNumberInput = styled.input.attrs({ type: "number" })`
  width: ${(p) => p.width + "ch"};
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
export const InputNumber = ({
  readOnly = false,
  placeholder = "0",
  min = 0,
  max = 100,
  step = 5,
  size = "medium",
  backgroundColor = "#565656",
  label = "Amount: ",
  ...props
}: InputNumberProps) => {
  const [width, setWidth] = useState(placeholder.toString().length);
  const inputEl = useRef<HTMLInputElement | null>(null);

  return (
    <Wrapper>
      <label htmlFor="number">{label}</label>
      <Button
        tabIndex={0}
        onClick={() => {
          if (!inputEl.current) return;
          inputEl.current.stepDown();
          setWidth(inputEl.current.value.length);
        }}
      >
        -
      </Button>
      <StyledNumberInput
        ref={inputEl}
        readOnly={readOnly}
        placeholder={min.toString()}
        min={min}
        max={max}
        step={step}
        style={{ width: width + "ch" }}
        {...props}
        tabIndex={0}
        onChange={(e) => {
          const { value } = e.target as HTMLInputElement;
          setWidth(value.length);
          if (parseFloat(value) >= max) {
            if (!inputEl.current) return;
            e.currentTarget.stepUp(0);
          }
        }}
      />
      <Button
        tabIndex={0}
        onClick={() => {
          if (!inputEl.current) return;
          inputEl.current.stepUp();
          setWidth(inputEl.current.value.length);
        }}
      >
        +
      </Button>
    </Wrapper>
  );
};

export default InputNumber;
