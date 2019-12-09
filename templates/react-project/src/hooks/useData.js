import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

const useData = (obj) => {
  const [data, setData] = useState({});
  const originalSaved = useRef();

  useEffect(() => {
    const original = Object
      .keys(obj)
      .reduce((acc, key) => ({
        ...acc,
        [key]: {
          value: obj[key].value,
          output: obj[key].output || ((v) => v),
          match: obj[key].match || (() => true),
        },
      }), {});
    originalSaved.current = original;
  });

  useEffect(() => {
    setData(Object.keys(obj).reduce((acc, key) => ({
      ...acc,
      [key]: obj[key].value,
    }), {}));
  }, []);

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
  });

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

  const validation = useCallback((key) => {
    if (key) {
      if (Object.hasOwnProperty.call(originalSaved.current, key)) {
        return originalSaved.current[key].match(data[key]);
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
  };
};


export default useData;
