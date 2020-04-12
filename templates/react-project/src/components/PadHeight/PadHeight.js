/** @jsx jsx */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { jsx, css } from '@emotion/core';

const PadHeight = React.memo(({
  children,
  style,
  type = 'top',
  className,
}) => {
  const list = useMemo(() => React
    .Children
    .toArray(children)
    .filter((child) => !!child && child.type), [children]);

  const childrenCount = useMemo(() => list.length, [list]);

  return (
    <div
      css={css`
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
      className={className}
      style={style}
    >
      {type === 'top' && childrenCount > 1 && list[0]}
      <div
        css={css`
          flex-grow: 1;
          position: relative;
        `}
      >
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
          `}
        >
          {
            childrenCount <= 1
              ? list[0]
              : (type === 'top' ? list.slice(1) : list.slice(0, childrenCount - 1))
          }
        </div>
      </div>
      {type === 'bottom' && childrenCount > 1 && list[childrenCount - 1]}
    </div>
  );
});

PadHeight.propTypes = {
  style: stylePropType,
  className: PropTypes.string,
  children: PropTypes.any, // eslint-disable-line
  type: PropTypes.oneOf(['top', 'bottom']),
};

export default PadHeight;
