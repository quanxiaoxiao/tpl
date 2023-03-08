import { useMemo, useReducer } from 'react';
import { actions, reducer, initialState } from './reducer';

const useRedux = () => {
  const [_state, _dispatch] = useReducer(reducer, initialState);

  const state = useMemo(() => ({
    ..._state,
  }), [_state]);

  const dispatch = useMemo(() => ({
    ...Object
      .keys(actions)
      .reduce((acc, actionName) => ({
        ...acc,
        [actionName]: (payload) => _dispatch(actions[actionName](payload)),
      }), {}),
  }), [
    _dispatch,
  ]);

  const store = useMemo(() => ({
    state,
    dispatch,
  }), [state, dispatch]);

  return store;
};

export default useRedux;
