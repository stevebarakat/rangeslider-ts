import { css } from "styled-components";
import { COLORS } from "./CSS_CONSTANTS";

export const cssVariables = css`
  :root {
    /* COLORS */
    --color-primary: ${COLORS.primary};
    --color-secondary: ${COLORS.secondary};
    --color-lightgray: ${COLORS.gray300};
    --color-gray: ${COLORS.gray500};
    --color-dark: ${COLORS.gray700};
    --color-transparent-gray: ${COLORS.transparentGray35};
    --color-light: ${COLORS.offWhite};

    /* SIZES */
    --slider-width: 950px;
    --slider-height: 475px;
  }
`;
