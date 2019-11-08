import { useContext } from 'react';
import _ from 'lodash';
import ColorContext from 'contexts/Color';

const useColor = () => {
  const { colors } = useContext(ColorContext);

  const getColor = (prop, color = colors.default) => {
    let value = _.get(colors, prop);
    if (_.isPlainObject(value)) {
      value = _.get(value, 'default');
    }
    if (!value) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`colors prop: ${prop} is not set`);
      }
      return _.get(colors, `${prop}.default`) || color;
    }
    return value;
  };

  return getColor;
};


export default useColor;
