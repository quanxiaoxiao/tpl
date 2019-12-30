import { useContext } from 'react';
import Context from './Context';


const useReducer = () => {
  const {
    state,
    dispatch,
    actions,
  } = useContext(Context);

  return {
    state,
    actions: Object
      .keys(actions)
      .reduce((acc, actionName) => ({
        ...acc,
        [actionName]: (payload) => dispatch(actions[actionName](payload)),
      }), {}),
  };
};

export default useReducer;
