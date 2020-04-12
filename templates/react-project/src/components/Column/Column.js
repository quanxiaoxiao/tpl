import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useScale from 'hooks/useScale';
import { useWidth } from 'components/BoxWidth';
import Context from './Context';

const Column = React.memo(({ width, list, children }) => {
  const containerWidth = useWidth();
  const sizes = useMemo(() => list.map((item) => item.width), [list]);
  const sizeList = useScale(width || containerWidth, sizes);

  return (
    <Context.Provider
      value={{
        columnList: list,
        sizeList,
      }}
    >
      {children}
    </Context.Provider>
  );
});

Column.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  width: PropTypes.number,
  list: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    width: PropTypes.number,
  })).isRequired,
};

export default Column;
