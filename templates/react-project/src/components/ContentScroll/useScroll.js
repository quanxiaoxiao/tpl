import { useContext } from 'react';
import Context from './Context';


const useScroll = () => {
  const {
    scrollTop,
    clientHeight,
    scrollHeight,
    onScroll,
  } = useContext(Context);

  return {
    scrollTop,
    clientHeight,
    scrollHeight,
    percent: scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight),
    onScroll,
  };
};


export default useScroll;
