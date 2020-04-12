import { useMemo, useContext } from 'react';
import Context from './Context';


const useScroll = () => {
  const state = useContext(Context);
  const percent = useMemo(() => {
    if (!state) {
      return 0;
    }
    if (state.scrollHeight === 0 || state.clientHeight === 0) {
      return 0;
    }
    if (state.scrollHeight <= state.clientHeight) {
      return 0;
    }
    return state.scrollTop / (state.scrollHeight - state.clientHeight);
  }, [state]);

  if (!state) {
    return {
      scrollTop: 0,
      clientHeight: 0,
      scrollHeight: 0,
      percent: 0,
      scrolling: false,
      isEnter: false,
    };
  }

  return {
    percent,
    scrollTop: state.scrollTop,
    clientHeight: state.clientHeight,
    scrollHeight: state.scrollHeight,
    onScroll: state.onScroll,
    setScroll: state.setScroll,
    scrolling: state.scrolling,
    isEnter: state.isEnter,
  };
};


export default useScroll;
