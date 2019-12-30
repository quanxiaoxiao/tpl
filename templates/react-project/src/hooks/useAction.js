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

  const actionSaved = useRef(fn);
  const matchSaved = useRef(match);
  const mounted = useRef();

  useEffect(() => {
    matchSaved.current = match;
    actionSaved.current = fn;
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const action = useCallback(async (...args) => {
    if (!mounted.current || pending || !matchSaved.current(...args)) {
      return;
    }
    pre();
    setPending(true);
    try {
      const ret = await actionSaved.current(...args);
      if (mounted.current) {
        resolve(ret);
      }
    } catch (error) {
      if (mounted.current) {
        reject(error);
      }
      console.error(error);
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
