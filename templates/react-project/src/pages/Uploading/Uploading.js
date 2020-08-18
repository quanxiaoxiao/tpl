/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';
import Paper from 'components/Paper';

const Uploading = React.memo(() => {
  const getColor = useColor();

  return (
    <div>
      <Paper>
        uploading
      </Paper>
    </div>
  );
});

export default Uploading;
