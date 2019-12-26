import { useRef, useContext, useEffect } from 'react';
import Context from 'View/Context';
import { actions } from 'View/reducer';

const useLoading = (pending) => {
  const {
    dispatch,
    state,
  } = useContext(Context);
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
        dispatch(actions.showLoading());
      }
    } else if (loadingShow) {
      dispatch(actions.hideLoading());
    }
    return () => {
      if (!mountSaved.current && loadingShow) {
        dispatch(actions.hideLoading());
      }
    };
  }, [pending, loadingShow]);
};


export default useLoading;
