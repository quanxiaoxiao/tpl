import { useContext } from 'react';
import ColorContext from 'contexts/Color';

const useColor = () => {
  const { data } = useContext(ColorContext);

  const getColor = (key) => {
    const value = data[key];
    if (!value) {
      console.warn(`color: ${key} unset`);
      return null;
    }
    return value;
  };

  return getColor;
};

export default useColor;
