import React from 'react';
import PropTypes from 'prop-types';
import Size from 'components/Size';
import Svg from './Svg';

const Container = React.memo(({
  children,
  ...props
}) => (
  <Size
    {...props}
  >
    <Svg>
      {children}
    </Svg>
  </Size>
));

Container.propTypes = {
  children: PropTypes.any, // eslint-disable-line
};

export default Container;
