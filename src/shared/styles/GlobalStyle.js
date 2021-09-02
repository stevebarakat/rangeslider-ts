import { createGlobalStyle } from "styled-components";
import { cssVariables } from "./css-variables";
import { cssStorybook } from "./css-storybook";
import { cssDefaults } from "./css-defaults";
import { cssReset } from "./css-reset";

export const GlobalStyle = createGlobalStyle`
  * {
    ${[cssReset, cssVariables, cssDefaults, cssStorybook]}
  }`;
