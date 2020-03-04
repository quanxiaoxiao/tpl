import {
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

const useData = (initData) => {
  const [data, setData] = useState(Object.keys(initData).reduce((acc, key) => ({
    ...acc,
    [key]: initData[key].value,
  }), {}));
  const originalSaved = useRef();

  useLayoutEffect(() => {
    const original = Object
      .keys(initData)
      .reduce((acc, key) => ({
        ...acc,
        [key]: {
          value: initData[key].value,
          output: initData[key].output || ((v) => v),
          match: initData[key].match || (() => true),
        },
      }), {});
    originalSaved.current = original;
  });

  const setValue = useCallback((key, value) => {
    if (typeof key === 'function') {
      setData((v) => ({
        ...v,
        ...key(v),
      }));
    } else if (Object.hasOwnProperty.call(data, key)) {
      setData({
        ...data,
        [key]: value,
      });
    }
  }, [data]);

  const getValue = useCallback((key) => data[key], [data]);

  const output = useCallback(() => {
    const ret = Object
      .keys(data)
      .reduce((acc, key) => ({
        ...acc,
        [key]: originalSaved.current[key].output(data[key]),
      }), {});
    return ret;
  }, [data]);

  const validation = useCallback((...args) => {
    if (!originalSaved.current) {
      return false;
    }
    const [key, value] = args;
    if (key) {
      if (Object.hasOwnProperty.call(originalSaved.current, key)) {
        const { match } = originalSaved.current[key];
        return args.length > 1 ? match(value) : match(data[key]);
      }
      return false;
    }
    return Object.keys(data).every((k) => {
      const item = originalSaved.current[k];
      return item.match(data[k], getValue, validation);
    });
  }, [data]);

  return {
    setValue,
    getValue,
    output,
    validation,
    data,
  };
};


export default useData;
