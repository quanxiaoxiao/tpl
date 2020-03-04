import { useRef, useEffect } from 'react';
import useStore from 'View/useStore';

const useLoading = (pending) => {
  const { state, dispatch } = useStore();
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
        dispatch.showLoading();
      }
    } else if (loadingShow) {
      dispatch.hideLoading();
    }
    return () => {
      if (!mountSaved.current && loadingShow) {
        dispatch.hideLoading();
      }
    };
  }, [pending, loadingShow]);
};


export default useLoading;
