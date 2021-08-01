import { useState, useRef } from 'react';
import styled from 'styled-components';

interface InputNumberProps {
  /**
   * Is this the principal call to action on the page?
   */
  readonly?: boolean;
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
  size?: 'small' | 'medium' | 'large';
  /**
   * Label for the input
   */
  label: string;
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
  width: ${p => p.width + "ch"};
  padding: 1rem;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}`;

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
 * Primary UI component for user interaction
 */
export const InputNumber = ({
  readonly = false,
  min = 0,
  max = 100,
  step = 5,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: InputNumberProps) => {
  const [width, setWidth] = useState(0);
  const inputEl: React.MutableRefObject<null> = useRef(null);

  return (
    <Wrapper>
      <label htmlFor="number">{label}</label>
      <Button
        tabIndex={0}
        onClick={() => {
          inputEl.current.stepDown(step);
          setWidth(inputEl.current.value.length);
        }}
      >-</Button>
      <StyledNumberInput
        ref={inputEl}
        readOnly={readonly}
        min={min}
        max={max}
        // step={step}
        style={{ width: width + "ch" }}
        {...props}
        tabIndex={0}
        onInput={(e) => {
          const { value } = e.target as HTMLInputElement;
          setWidth(value.length);
        }}
      />
      <Button
        tabIndex={0}
        onClick={() => {
          inputEl.current.stepUp(step);
          setWidth(inputEl.current.value.length);
        }}
      >+</Button>
    </Wrapper>
  );
};

export default InputNumber;