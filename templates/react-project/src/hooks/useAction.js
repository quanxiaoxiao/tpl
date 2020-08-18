import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';

const useAction = (options) => {
  const [pending, setPending] = useState(false);

  const actionSaved = useRef(options.fn);
  const matchSaved = useRef(options.match);
  const mounted = useRef();

  useLayoutEffect(() => {
    matchSaved.current = options.match;
    actionSaved.current = options.fn;
  });

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const action = useCallback(async (...args) => {
    if (!mounted.current || pending || (matchSaved.current && !matchSaved.current(...args))) {
      return;
    }
    if (options.pre) {
      options.pre();
    }
    setPending(true);
    try {
      const ret = await actionSaved.current(...args);
      if (mounted.current && options.resolve) {
        options.resolve(ret);
      }
    } catch (error) {
      if (mounted.current && options.reject) {
        options.reject(error);
      }
      console.error(error);
    } finally {
      if (mounted.current) {
        setPending(false);
        if (options.final) {
          options.final();
        }
      }
    }
  }, [pending, options]);

  return {
    action,
    pending,
  };
};

export default useAction;
