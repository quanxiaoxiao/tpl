/** @jsx jsx */
/* eslint import/prefer-default-export: 0 */
import { css } from '@emotion/core';

export const init = css`
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}

html {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
}

html {
  font-size: 100%;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  font-family: inherit;
}

* {
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

a,
button {
  cursor: pointer;
  color: inherit;
}
`;
