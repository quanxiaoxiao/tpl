/** @jsx jsx */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const ScrollBar = React.memo(({
  offsetY,
  contentHeight,
  bodyHeight,
}) => {
  const getColor = useColor();

  const style = useMemo(() => {
    const diff = contentHeight - bodyHeight;
    if (bodyHeight * 0.8 > diff) {
      return {
        height: bodyHeight - diff,
        top: offsetY,
      };
    }
    return {
      height: bodyHeight * 0.3,
      top: (bodyHeight * 0.7) * (offsetY / diff),
    };
  }, [contentHeight, bodyHeight, offsetY]);


  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 0.4rem;
        background: ${getColor('fill.scrollbar.track')};
        z-index: 1;
        pointer-events: none;
      `}
      aria-label="scrollbar"
    >
      <div
        css={css`
          position: absolute;
          left: 0;
          width: 100%;
          background: ${getColor('fill.scrollbar.thumb')};
        `}
        style={style}
      />
    </div>
  );
});

ScrollBar.propTypes = {
  offsetY: PropTypes.number.isRequired,
  contentHeight: PropTypes.number.isRequired,
  bodyHeight: PropTypes.number.isRequired,
};

export default ScrollBar;
