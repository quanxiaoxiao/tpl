import { useContext } from 'react';
import _ from 'lodash';
import ColorContext from 'contexts/Color';

const useColor = () => {
  const { colors } = useContext(ColorContext);
  const list = colors._ || [];

  const getColor = (prop, color = colors.default) => {
    let value = _.get(colors, prop);
    if (_.isPlainObject(value)) {
      value = _.get(value, 'default');
    }
    if (!value) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`colors prop: ${prop} is not set`);
      }
      value = _.get(colors, `${prop}.default`) || color;
    }
    if (/^\$(\d+)/.test(value)) {
      value = list[RegExp.$1] || color;
    }
    return value;
  };

  return getColor;
};


export default useColor;
