import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import useAction from './useAction';

const useActionDo = (params, options) => {
  const waitingSaved = useRef(false);
  const argsSaved = useRef();
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

  useEffect(() => {
    paramsSaved.current = params;
  }, [params]);

  const executeAction = useCallback((...args) => {
    if (pending) {
      waitingSaved.current = true;
      argsSaved.current = args;
    } else {
      lastParamsSaved.current = paramsSaved.current;
      action(paramsSaved.current, ...args);
    }
  }, [action, pending]);


  useEffect(executeAction, [params]);

  useEffect(() => {
    if (!pending && waitingSaved.current) {
      waitingSaved.current = false;
      setTimeout(() => {
        lastParamsSaved.current = paramsSaved.current;
        action(lastParamsSaved.current, ...argsSaved.args);
        argsSaved.args = null;
      }, 0);
    }
  }, [action, pending]);

  return {
    pending,
    action: executeAction,
  };
};

export default useActionDo;
