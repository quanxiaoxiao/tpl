const createReducer = (obj) => {
  const actions = Object
    .entries(obj)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: (payload) => ({
        type: key,
        payload: (state, logger) => {
          if (typeof payload === 'function') {
            payload = payload(state); // eslint-disable-line
          }
          if (logger) {
            logger('%c payload', 'color: #91c7ae;', payload);
          }
          return value(state, payload);
        },
      }),
    }), {});
  return {
    actions,
    reducer: (prevState, { type, payload }) => {
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(type);
        console.log('%c Previous State', 'color: #91c7ae;', prevState);
        const state = payload(prevState, console.log.bind(console));
        console.log('%c Current State', 'color: #91c7ae;', state);
        console.groupEnd();
        return state;
      }
      return payload(prevState);
    },
  };
};

export default createReducer;
