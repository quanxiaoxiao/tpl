import React from 'react';
import PropTypes from 'prop-types';
import useSize from './useSize';

const G = React.memo(({ children, ...other }) => {
  const clientRect = useSize();

  return (
    <g
      {...other}
    >
      {children && children(clientRect)}
    </g>
  );
});

G.propTypes = {
  children: PropTypes.func,
};

export default G;
