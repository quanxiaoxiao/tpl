import { useContext } from 'react';
import _ from 'lodash';
import SizeContext from 'contexts/Size';
import FontSizeContext from 'contexts/FontSize';

const useSize = () => {
  const { sizes } = useContext(SizeContext);
  const fontSize = useContext(FontSizeContext);

  const getSize = (prop, ratio = 1, isNumber) => {
    let value = _.get(sizes, prop);
    if (_.isPlainObject(value)) {
      value = _.get(value, 'default');
    }
    if (value == null) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`size prop: ${prop} is not set`);
      }
      return 0;
    }
    if (_.isNumber(value)) {
      if (ratio === false) {
        return value;
      }
      if (isNumber) {
        return fontSize * value * ratio;
      }
      return `${fontSize * value * ratio}px`;
    }
    return value;
  };

  return getSize;
};


export default useSize;
