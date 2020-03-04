/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const Input = React.memo((props) => {
  const getColor = useColor();

  return (
    <input
      css={css`
        border: 1px solid ${getColor('a01')};
        border-radius: 6px;
        color: ${getColor('a00')};
        display: block;
        font-weight: 600;
        height: 2.8rem;
        padding: 0 0.6rem;
        transition: all 175ms ease-out;
        width: 100%;
        &:focus {
          border-color: ${getColor('a00')};
          box-shadow: 0 0 0px 1.5px ${getColor('a00')};
        }
      `}
      {...props}
    />
  );
});

export default Input;
