import { css } from "styled-components";
import { COLORS } from "./CSS_CONSTANTS";

export const cssVariables = css`
  :root {
    --color-primary: ${COLORS.primary};
    --color-secondary: ${COLORS.secondary};
    --color-lightgray: ${COLORS.gray300};
    --color-gray: ${COLORS.gray500};
    --color-darkgray: ${COLORS.gray700};
    --color-transparent-gray: ${COLORS.transparentGray35};
    --color-white: ${COLORS.offWhite};
  }
`;
