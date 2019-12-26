import { useContext } from 'react';
import Context from 'View/Context';
import { actions } from 'View/reducer';

const useToastr = () => {
  const { dispatch } = useContext(Context);
  return {
    showLoading: () => {
      dispatch(actions.showLoading());
    },
    hideLoading: () => {
      dispatch(actions.hideLoading());
    },
    ...[
      'info',
      'error',
      'warning',
    ].reduce((acc, name) => ({
      ...acc,
      [name]: (message, { position, duration } = {}) => {
        dispatch(actions.addToastr({
          type: name,
          message,
          position,
          duration,
        }));
      },
    }), {}),
  };
};


export default useToastr;
