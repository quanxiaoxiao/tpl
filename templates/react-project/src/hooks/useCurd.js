import { useState } from 'react';


const useCurd = (data) => {
  const [list, setList] = useState(data);

  const update = (d) => {
    const index = list.findIndex((item) => item.id === d.id);
    if (index === -1) {
      return index;
    }
    if (index === 0) {
      const [, ...other] = list;
      setList([d, ...other]);
    } else {
      setList([...list.slice(0, index), d, ...list.slice(index + 1)]);
    }
    return index;
  };

  const remove = (id) => {
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      return index;
    }
    if (index === 0) {
      const [, ...other] = list;
      setList(other);
    } else {
      setList([...list.slice(0, index), ...list.slice(index + 1)]);
    }
    return index;
  };

  const insert = (item) => {
    setList([item, ...list]);
    return item;
  };

  const append = (item) => {
    setList([...list, item]);
    return item;
  };

  const change = (v) => setList(v);

  return {
    list,
    append,
    insert,
    remove,
    update,
    change,
  };
};

export default useCurd;
