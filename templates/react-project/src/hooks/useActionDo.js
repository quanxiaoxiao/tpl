import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import useAction from './useAction';

const useActionDo = (params, options) => {
  const waitingSaved = useRef(false);
  const argsSaved = useRef([]);
  const paramsSaved = useRef();
  const lastParamsSaved = useRef();

  const actionOptions = useMemo(() => ({
    ...options,
    resolve: (...args) => {
      if (options.resolve && lastParamsSaved.current === paramsSaved.current) {
        options.resolve(...args);
      }
    },
  }), [options]);

  const {
    pending,
    action,
  } = useAction(actionOptions);

  const executeAction = useCallback((...args) => {
    if (pending) {
      waitingSaved.current = true;
      argsSaved.current = args;
    } else {
      argsSaved.current = [];
      lastParamsSaved.current = paramsSaved.current;
      action(paramsSaved.current, ...args);
    }
  }, [action, pending]);

  useEffect(() => {
    if (paramsSaved.current !== params) {
      paramsSaved.current = params;
      executeAction();
    }
  }, [params, executeAction]);

  useEffect(() => {
    if (!pending && waitingSaved.current) {
      waitingSaved.current = false;
      requestAnimationFrame(() => {
        lastParamsSaved.current = paramsSaved.current;
        action(lastParamsSaved.current, ...argsSaved.current);
        argsSaved.current = [];
      });
    }
  }, [action, pending]);

  return {
    pending,
    action: executeAction,
  };
};

export default useActionDo;
