import { memo } from 'react';
import Context from './Context';
import useRedux from './useRedux';

const {{name}} = memo(() => {
  const store = useRedux();
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
