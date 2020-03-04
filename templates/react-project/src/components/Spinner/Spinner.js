/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx, css } from '@emotion/core';
import _ from 'lodash';

const Spinner = React.memo(() => {
  const bars = useMemo(() => _
    .times(12)
    .map((idx) => (
      <div
        style={{
          animationDelay: `${(idx - 12) / 10}s`,
          transform: `rotate(${idx * 30}deg) translate(146%)`,
        }}
        css={css`
            animation: spinner_spin 1.2s linear infinite;
            background-color: #fff;
            border-radius: 5px;
            height: 7.8%;
            left: -10%;
            position: absolute;
            top: -3.9%;
            width: 20%;
          `}
        key={idx}
      />
    )), []);
  return (
    <div
      css={css`
        height: 32px;
        left: 50%;
        position: absolute;
        top: 50%;
        width: 32px;
        @keyframes spinner_spin {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}
    >
      {bars}
    </div>
  );
});

export default Spinner;
