/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const Test = React.memo(() => {
  const getColor = useColor();

  return (
    <div>
      test
    </div>
  );
});

export default Test;
