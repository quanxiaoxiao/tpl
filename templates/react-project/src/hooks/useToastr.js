import useStore from 'View/useStore';

const useToastr = () => {
  const { dispatch } = useStore();
  return {
    showLoading: () => {
      dispatch.showLoading();
    },
    hideLoading: () => {
      dispatch.hideLoading();
    },
    ...[
      'info',
      'error',
      'warning',
    ].reduce((acc, name) => ({
      ...acc,
      [name]: (message, { position, duration } = {}) => {
        dispatch.addToastr({
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
