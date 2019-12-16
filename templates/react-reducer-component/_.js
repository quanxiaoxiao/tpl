import React, { useReducer } from 'react';
import Context from './Context';
import { reducer, initialState } from './reducer';

const {{name}} = React.memo(() => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const store = {
    state,
    dispatch,
  };

  return (
    <Context.Provider
      value={store}
    >
      <div>
      </div>
    </Context.Provider>
  );
});

export default {{name}};
