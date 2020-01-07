import { useContext } from 'react';
import Context from './Context';

const useSize = () => {
  const clientRect = useContext(Context);
  return clientRect;
};


export default useSize;
