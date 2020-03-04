import { useContext } from 'react';
import Context from './Context';


const useScroll = () => {
  const {
    scrollTop,
    clientHeight,
    scrollHeight,
    scrolling,
    onScroll,
    setScroll,
  } = useContext(Context);

  return {
    scrollTop,
    clientHeight,
    scrollHeight,
    percent: scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight),
    onScroll,
    setScroll,
    scrolling,
  };
};


export default useScroll;
