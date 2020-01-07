/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import { useSize } from 'components/Size';
import useRect from 'hooks/useRect';
import Context from './Context';

const Svg = React.memo(({
  children,
  margin,
  ...other
}) => {
  const { containerWidth, containerHeight } = useSize();

  const clientRect = useRect(containerWidth, containerHeight, margin);

  return (
    <Context.Provider
      value={clientRect}
    >
      <svg
        css={css`
          display: block;
          width: 100%;
        `}
        {...other}
      >
        <g
          transform={`translate(${clientRect.margin.left}, ${clientRect.margin.top})`}
        >
          {children}
        </g>
      </svg>
    </Context.Provider>
  );
});

Svg.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  margin: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
};

export default Svg;
