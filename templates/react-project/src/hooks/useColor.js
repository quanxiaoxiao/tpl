import { useContext } from 'react';
import _ from 'lodash';
import ColorContext from 'contexts/Color';

const useColor = () => {
  const { data } = useContext(ColorContext);
  const list = data._ || [];

  const getColor = (prop = 'default') => {
    let index = _.get(data.data, prop);
    if (_.isPlainObject(index)) {
      index = _.get(index, 'default');
    }
    if (index == null) {
      console.warn(`color: ${prop} unset`);
      return '#f00';
    }
    return list[index];
  };

  return getColor;
};


export default useColor;
