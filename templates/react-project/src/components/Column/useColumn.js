import { useContext } from 'react';
import Context from './Context';

const useColumn = () => {
  const { sizeList, columnList } = useContext(Context);
  return {
    sizeList,
    columnList,
  };
};

export default useColumn;
