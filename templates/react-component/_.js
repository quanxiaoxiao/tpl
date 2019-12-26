/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const {{name}} = React.memo(() => {
  const getColor = useColor();

  return (
    <div>
    </div>
  );
});

export default {{name}};
