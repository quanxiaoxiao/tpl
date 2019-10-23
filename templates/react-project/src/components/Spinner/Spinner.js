/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const Spinner = React.memo((props) => {
  const getColor = useColor();
  return (
    <svg
      viewBox="0 0 50 50"
      css={css`
        position: absolute;
        width: 1.6rem;
        height: 1.6rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `}
      {...props}
    >
      <path
        fill={getColor('spinner')}
        d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
        transform="rotate(257.058 25 25)"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
});

export default Spinner;
