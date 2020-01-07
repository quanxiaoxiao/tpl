import { useContext } from 'react';
import Context from './Context';

const useColumn = () => {
  const { list, width } = useContext(Context);

  return {
    list,
    width,
  };
};


export default useColumn;
