import { useContext } from 'react';
import Context from './Context';

const useColumn = () => {
  const list = useContext(Context);

  return {
    list,
  };
};


export default useColumn;
