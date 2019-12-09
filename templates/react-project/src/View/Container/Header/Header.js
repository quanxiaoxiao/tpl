import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import useSize from 'hooks/useSize';
import useColor from 'hooks/useColor';

const Header = React.memo(() => {
  const getSize = useSize();
  const getColor = useColor();

  return (
    <div
      css={css`
        height: ${getSize('height.header')};
        background: ${getColor('fill')};
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        position: relative;
        z-index: 1;
      `}
    >
      asdf
    </div>
  );
});

export default Header;
