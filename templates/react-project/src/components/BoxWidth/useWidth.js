import { useContext } from 'react';
import Context from './Context';

const useWidth = () => {
  const containerWidth = useContext(Context);

  return containerWidth;
};

export default useWidth;
