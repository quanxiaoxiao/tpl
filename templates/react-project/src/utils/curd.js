const update = (list, a) => list.map((item) => (item.id === a.id ? a : item));

const remove = (list, id) => list.filter((item) => item.id !== id);

const append = (list, item) => [...list, item];

const insert = (list, item) => [item, ...list];


export default {
  update,
  remove,
  append,
  insert,
};
