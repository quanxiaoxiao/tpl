/** @jsx jsx */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';

const clamp = (v) => Math.max(Math.min(v, 1), 0);

const HorizontalSlider = React.memo(({
  onChange,
  ...other
}) => {
  const rangeXSaved = useRef();

  const handleMouseMoveOnDoc = (ev) => {
    const [min, max] = rangeXSaved.current;
    let nextValue;
    if (ev.clientX < min) {
      nextValue = 0;
    } else if (ev.clientX > max) {
      nextValue = 1;
    } else {
      nextValue = clamp((ev.clientX - min) / (max - min));
    }
    onChange(nextValue);
  };

  const handleMouseUpOnDoc = () => {
    document.removeEventListener('mousemove', handleMouseMoveOnDoc);
    document.removeEventListener('mouseup', handleMouseUpOnDoc);
    document.body.style.userSelect = null;
    rangeXSaved.current = null;
  };

  const handleMouseDown = (ev) => {
    const rect = ev.target.getBoundingClientRect();
    const nextValue = clamp((ev.clientX - rect.left) / rect.width);
    onChange(nextValue);
    rangeXSaved.current = [rect.left, rect.left + rect.width];
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMoveOnDoc);
    document.addEventListener('mouseup', handleMouseUpOnDoc);
  };

  return (
    <div
      css={css`
        height: 100%;
        position: relative;
        user-select: none;
        > * {
          pointer-events: none;
        }
      `}
      onMouseDown={handleMouseDown}
      {...other}
    />
  );
});

HorizontalSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default HorizontalSlider;
