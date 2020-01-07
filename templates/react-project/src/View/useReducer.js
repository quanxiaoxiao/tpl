import { useContext } from 'react';
import Context from './Context';


const useReducer = () => {
  const {
    state,
    actions,
  } = useContext(Context);

  return {
    state,
    actions,
  };
};

export default useReducer;
