import { createGlobalStyle, css } from "styled-components";
import { COLORS } from "./constants";

export const fontUrl =
  "https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900";

export const bodyStyles = css`
  /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
  }

  :root {
    --color-primary: ${COLORS.primary};
    --color-secondary: ${COLORS.secondary};
    --color-lightgray: ${COLORS.gray300};
    --color-gray: ${COLORS.gray500};
    --color-darkgray: ${COLORS.gray700};
    --color-transparent-gray: ${COLORS.transparentGray35};
    --color-white: ${COLORS.offWhite};
  }

  body {
    box-sizing: border-box;
    font-family: sans-serif;
    background: #fefefe;
  }

  h2 {
    border-bottom: none !important;
  }

  h3 {
    font-weight: 800;
  }

  h4 {
    font-weight: bold;
    font-size: 1.75rem !important;
  }

  p {
    padding-bottom: none;
    margin-bottom: none;
    margin-block-end: 0;
  }

  li {
    list-style: disc;
  }
  .css-1wjen9k {
    margin: 0;
  }

  .css-tmvzag {
    margin-top: 0;
  }

  .css-10n01gg tr {
    border: none;
  }

  .css-10n01gg tr th {
    border: none;
  }

  .css-10n01gg tr td {
    border: none;
  }
  .css-10n01gg tr td,
  .css-10n01gg tr th {
    padding-left: 0;
  }
  .css-ypcfyr {
    margin: 0;
  }
  .mdp {
    color: #666666;
  }

  .flex {
    display: flex;
    gap: 1em;
    width: 100%;
    justify-content: center;
    align-items: flex-end;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    padding: 0;
    margin: 0;
    gap: 1em;
    border: 1px dotted pink;
  }

  .important {
    color: red;
    font-size: 1em;
  }

  .short-story {
    height: 32px;
  }
  .mid-story {
    height: 129px;
  }
`;

export const GlobalStyle = createGlobalStyle`
  html {
    ${bodyStyles}
  }`;
