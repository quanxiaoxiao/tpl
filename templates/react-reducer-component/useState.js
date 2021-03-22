import {
  useMemo,
  useReducer,
} from 'react';
import { reducer, initialState, actions } from './reducer';

const useState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const _dispatch = useMemo(() => ({
    ...Object
      .keys(actions)
      .reduce((acc, actionName) => ({
        ...acc,
        [actionName]: (payload) => dispatch(actions[actionName](payload)),
      }), {}),
  }), [dispatch]);

  const _state = useMemo(() => ({
    ...state,
  }), [
    state,
  ]);

  return {
    state: _state,
    dispatch: _dispatch,
  };
};

export default useState;
