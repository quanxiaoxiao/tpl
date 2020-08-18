/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';

const Paper = React.memo((props) => (
  <div
    css={css`
        background: #fff;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 40, 100, 0.12);
        border-radius: 3px;
      `}
    {...props}
  />
));

export default Paper;
