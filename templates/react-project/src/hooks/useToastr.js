import useReducer from 'View/useReducer';

const useToastr = () => {
  const { actions } = useReducer();
  return {
    showLoading: () => {
      actions.showLoading();
    },
    hideLoading: () => {
      actions.hideLoading();
    },
    ...[
      'info',
      'error',
      'warning',
    ].reduce((acc, name) => ({
      ...acc,
      [name]: (message, { position, duration } = {}) => {
        actions.addToastr({
          type: name,
          message,
          position,
          duration,
        });
      },
    }), {}),
  };
};


export default useToastr;
