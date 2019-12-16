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
    message: () => {
    },
    error: () => {
    },
    warning: () => {
    },
  };
};


export default useToastr;
