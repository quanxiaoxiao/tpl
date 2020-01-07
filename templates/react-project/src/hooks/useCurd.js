import { useState } from 'react';


const useCurd = (initArr = []) => {
  const [list, setList] = useState(initArr);
  const [size, setSize] = useState(initArr.length);

  const findIndex = (query) => {
    if (size === 0) {
      return -1;
    }
    const keys = Object.keys(query);
    if (keys.length === 0) {
      return 0;
    }
    return list.findIndex((item) => keys.every((key) => item[key] === query[key]));
  };

  const update = (query, d) => {
    const index = findIndex(query);
    if (index === -1) {
      return index;
    }
    setList([...list.slice(0, index), { ...list[index], ...d }, ...list.slice(index + 1)]);
    return index;
  };

  const remove = (query) => {
    const index = findIndex(query);
    if (index === -1) {
      return index;
    }
    setList([...list.slice(0, index), ...list.slice(index + 1)]);
    setSize(size - 1);
    return index;
  };

  const insert = (item, query) => {
    if (query) {
      const index = findIndex(query);
      if (index !== -1) {
        const arr = [...list];
        arr.splice(index, 0, item);
        setList(arr);
        setSize(size + 1);
      }
    } else {
      setList([item, ...list]);
      setSize(size + 1);
    }
  };

  const append = (...args) => {
    setList([...list, ...args]);
    setSize(size + args.length);
  };

  const filter = (query) => {
    if (size === 0) {
      setList([]);
    } else {
      const keys = Object.keys(query);
      if (keys.length === 0) {
        setList([]);
        setSize(0);
      } else {
        const nextList = list.filter((item) => !keys.every((key) => item[key] === query[key]));
        setList(nextList);
        setSize(nextList.length);
      }
    }
  };

  const find = (query) => {
    const index = findIndex(query);
    if (index === -1) {
      return null;
    }
    return list[index];
  };

  const clear = () => {
    setList([]);
    setSize(0);
  };

  const change = (arr) => {
    if (list.length === 0 && arr.length === 0) {
      return;
    }
    setList(arr);
    setSize(arr.length);
  };

  return {
    list,
    append,
    insert,
    remove,
    update,
    change,
    clear,
    size,
    filter,
    find,
  };
};

export default useCurd;
