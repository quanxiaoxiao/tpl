import {
  useState,
  useEffect,
} from 'react';

const calc = (size, range) => {
  const len = range.length;
  if (size === 0 || len === 0) {
    return [];
  }
  const fixedWidthList = range
    .filter((d) => typeof d === 'number' && d >= 1);
  const percentWidthList = range
    .filter((d) => typeof d === 'number' && d < 1);

  const fiexdUsaged = fixedWidthList.reduce((acc, cur) => acc + cur, 0);
  const percentUsaged = percentWidthList.reduce((acc, cur) => acc + cur, 0);
  if (fiexdUsaged > size || percentUsaged > 1) {
    console.error('size usage exceed container size');
    return [];
  }
  const restCount = len - fixedWidthList.length - percentWidthList.length;
  const restPerPercent = restCount === 0
    ? 0
    : (1 - fiexdUsaged / size - percentUsaged) / restCount;
  return range
    .map((item) => {
      if (typeof item === 'number') {
        return {
          percent: item >= 1 ? item / size : item,
          size: item >= 1 ? item : item * size,
          raw: item,
        };
      }
      return {
        percent: restPerPercent,
        size: restPerPercent * size,
        raw: null,
      };
    });
};


const useScale = (size, range) => {
  const [list, setList] = useState(calc(size, range));

  useEffect(() => {
    setList(calc(size, range));
  }, [size, ...range]);

  return list;
};

export default useScale;
