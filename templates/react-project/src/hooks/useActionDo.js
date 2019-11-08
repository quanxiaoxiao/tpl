import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import useAction from './useAction';

const useActionDo = (params, options) => {
  const savedLastDo = useRef(false);
  const savedParams = useRef();
  const savedLastParams = useRef();

  const _options = useMemo(() => ({
    ...options,
    resolve: (...args) => {
      if (options.resolve && savedLastParams.current === savedParams.current) {
        options.resolve(...args);
      }
    },
  }), [options]);

  const {
    pending,
    action,
  } = useAction(_options);

  useEffect(() => {
    savedParams.current = params;
  });

  const doAction = useCallback(() => {
    if (pending) {
      savedLastDo.current = true;
    } else {
      savedLastParams.current = savedParams.current;
      action(savedParams.current);
    }
  }, [action, pending]);


  useEffect(doAction, [params]);

  useEffect(() => {
    if (!pending && savedLastDo.current) {
      savedLastDo.current = false;
      setTimeout(() => {
        savedLastParams.current = savedParams.current;
        action(savedParams.current);
      }, 0);
    }
  }, [action, pending]);

  return {
    pending,
    action: doAction,
  };
};

export default useActionDo;
