import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import _ from 'lodash';

const useData = (obj) => {
  const [data, setData] = useState(null);
  const dataSaved = useRef();

  useEffect(() => {
    const _data = Object
      .keys(obj)
      .reduce((acc, key) => ({
        ...acc,
        [key]: {
          value: obj[key].value,
          output: obj[key].output || ((v) => v),
          match: obj[key].match || (() => true),
        },
      }), {});
    dataSaved.current = _data;
    setData(_data);
  }, []);

  const setValue = useCallback((key, value) => {
    const _data = dataSaved.current;
    if (_data && Object.hasOwnProperty.call(_data, key)) {
      const __data = {
        ..._data,
        [key]: {
          ..._data[key],
          value,
        },
      };
      dataSaved.current = __data;
      setData(__data);
    }
  }, [data]);

  const getValue = useCallback((key) => {
    const _data = dataSaved.current;
    if (_data && Object.hasOwnProperty.call(_data, key)) {
      return _data[key].value;
    }
    return null;
  }, [data]);

  const output = useCallback(() => {
    const ret = Object
      .keys(data)
      .reduce((acc, key) => ({
        ...acc,
        [key]: data[key].output(data[key].value),
      }), {});
    return ret;
  }, [data]);

  const validation = useCallback((key) => {
    const _data = dataSaved.current;
    if (_.isEmpty(_data)) {
      return false;
    }
    if (key) {
      if (_data && Object.hasOwnProperty.call(_data, key)) {
        const item = _data[key];
        return item.match(item.value);
      }
    }
    return Object.keys(_data).every((k) => {
      const item = _data[k];
      return item.match(item.value);
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
