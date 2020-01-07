import { useRef, useEffect } from 'react';
import useReducer from 'View/useReducer';

const useLoading = (pending) => {
  const { state, actions } = useReducer();
  const mountSaved = useRef();
  const { loadingShow } = state;
  useEffect(() => {
    mountSaved.current = true;
    return () => {
      mountSaved.current = false;
    };
  }, []);

  useEffect(() => {
    if (pending) {
      if (!loadingShow) {
        actions.showLoading();
      }
    } else if (loadingShow) {
      actions.hideLoading();
    }
    return () => {
      if (!mountSaved.current && loadingShow) {
        actions.hideLoading();
      }
    };
  }, [pending, loadingShow]);
};


export default useLoading;
