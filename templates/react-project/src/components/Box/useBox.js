import { useContext } from 'react';
import Context from './Context';

const useBox = () => {
  const {
    containerWidth,
    containerHeight,
  } = useContext(Context);

  return {
    containerWidth,
    containerHeight,
  };
};

export default useBox;
