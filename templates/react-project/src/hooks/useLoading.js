import { useRef, useEffect } from 'react';
import useStore from 'View/useStore';

const useLoading = (pending) => {
  const { state, dispatch } = useStore();
  const { showLoading, hideLoading } = dispatch;
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
        showLoading();
      }
    } else if (loadingShow) {
      hideLoading();
    }
    return () => {
      if (!mountSaved.current && loadingShow) {
        hideLoading();
      }
    };
  }, [pending, loadingShow, hideLoading, showLoading]);
};

export default useLoading;
