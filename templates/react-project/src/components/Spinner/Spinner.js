/** @jsx jsx */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import _ from 'lodash';
import useColor from 'hooks/useColor';

const Spinner = React.memo(({
  type = 0,
}) => {
  const getColor = useColor();
  const map = {
    0: getColor('a04'),
    1: getColor('a01'),
  };
  const bars = useMemo(() => _
    .times(12)
    .map((idx) => (
      <i
        style={{
          animationDelay: `${(idx - 12) / 10}s`,
          transform: `rotate(${idx * 30}deg) translate(146%)`,
        }}
        css={css`
            animation: spinner_spin 1.2s linear infinite;
            background-color: ${map[type]};
            border-radius: 3px;
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
    <span
      css={css`
        height: 2rem;
        width: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        @keyframes spinner_spin {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}
    >
      {bars}
    </span>
  );
});

Spinner.propTypes = {
  type: PropTypes.oneOf([0, 1]),
};

export default Spinner;
