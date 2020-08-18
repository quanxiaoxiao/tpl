import { useMemo, useContext } from 'react';
import Context from './Context';

const useScroll = () => {
  const state = useContext(Context);
  const {
    scrollTop = 0,
    scrollHeight = 0,
    clientHeight = 0,
    onScroll,
    setScroll,
    scrolling,
    isEnter,
  } = (state || {});

  const percent = useMemo(() => {
    if (scrollHeight === 0 || clientHeight === 0) {
      return 0;
    }
    if (scrollHeight <= clientHeight) {
      return 0;
    }
    return scrollTop / (scrollHeight - clientHeight);
  }, [scrollTop, scrollHeight, clientHeight]);

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
    scrollTop,
    clientHeight,
    scrollHeight,
    scrolling,
    isEnter,
    onScroll,
    setScroll,
  };
};

export default useScroll;
