/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const Resources = React.memo(() => {
  const getColor = useColor();

  return (
    <div>
      resources
    </div>
  );
});

export default Resources;
