import { useContext } from 'react';
import Context from './Context';


const useSize = () => {
  const {
    containerWidth,
    containerHeight,
  } = useContext(Context);

  return {
    containerWidth,
    containerHeight,
  };
};


export default useSize;
