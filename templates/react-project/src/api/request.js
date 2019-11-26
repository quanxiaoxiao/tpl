const get = (path) => fetch(`${path}`, {
  credentials: 'include',
}).then((a) => a.json());


export default {
  get,
};
