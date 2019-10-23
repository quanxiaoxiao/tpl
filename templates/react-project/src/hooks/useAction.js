import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

const useAction = (options) => {
  const [pending, setPending] = useState(false);
  const {
    fn,
    pre = () => {},
    match = () => true,
    resolve = () => {},
    reject = () => {},
    final = () => {},
  } = options;

  const savedCallback = useRef(fn);
  const savedMatch = useRef(match);
  const mounted = useRef();

  useEffect(() => {
    savedMatch.current = match;
    savedCallback.current = fn;
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const action = useCallback(async (...args) => {
    if (!savedMatch.current(...args) || pending || !mounted.current) {
      return;
    }
    pre();
    setPending(true);
    try {
      const ret = await savedCallback.current(...args);
      if (mounted.current) {
        resolve(ret);
      }
    } catch (error) {
      if (mounted.current) {
        reject(error);
      }
    } finally {
      if (mounted.current) {
        setPending(false);
        final();
      }
    }
  }, [pending, options]);


  return {
    action,
    pending,
  };
};

export default useAction;
