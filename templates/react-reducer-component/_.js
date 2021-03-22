import Context from './Context';
import useState from './useState';

const {{name}} = () => {
  const { state, dispatch } = useState();

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
};

export default {{name}};
