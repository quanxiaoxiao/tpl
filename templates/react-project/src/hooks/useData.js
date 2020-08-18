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
  const originalSaved = useRef(Object
    .keys(initData)
    .reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initData[key].value,
        output: initData[key].output || ((v) => v),
        match: initData[key].match || (() => true),
      },
    }), {}));

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
  }, [initData]);

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

  const output = useCallback((dataKey) => {
    if (dataKey) {
      return originalSaved.current[dataKey].output(data[dataKey], data);
    }
    const ret = Object
      .keys(data)
      .reduce((acc, key) => ({
        ...acc,
        [key]: originalSaved.current[key].output(data[key], data),
      }), {});
    return ret;
  }, [data]);

  const validate = useCallback((...args) => {
    if (!originalSaved.current) {
      return [null, null, ''];
    }
    if (args.length !== 0) {
      const [dataKey] = args;
      if (Object.hasOwnProperty.call(originalSaved.current, dataKey)) {
        const item = originalSaved.current[dataKey];
        const value = data[dataKey];
        try {
          const ret = item.match(value, getValue, validate);
          if (ret) {
            return null;
          }
          return [dataKey, value, ''];
        } catch (error) {
          return [dataKey, value, error.message];
        }
      }
      return [dataKey, null, `\`${dataKey}\` not register`];
    }
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const dataKey = keys[i];
      const value = data[dataKey];
      const item = originalSaved.current[dataKey];
      try {
        const ret = item.match(value, getValue, validate);
        if (!ret) {
          return [dataKey, value, ''];
        }
      } catch (error) {
        return [dataKey, value, error.message];
      }
    }
    return null;
  }, [data, getValue]);

  return {
    setValue,
    getValue,
    output,
    data,
    validate,
  };
};

export default useData;
