import React from 'react';
import PropTypes from 'prop-types';

const Item = ({ width, gap, ...other }) => (
  <div {...other} />
);

Item.propTypes = {
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Item.displayName = 'LayoutItem';

export default Item;
