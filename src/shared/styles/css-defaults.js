import { css } from "styled-components";

export const cssDefaults = css`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: sans-serif;
  }
  [data-prefix]::before {
    content: attr(data-prefix) " ";
  }
`;
