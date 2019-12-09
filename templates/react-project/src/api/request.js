const get = (path) => fetch(`${path}`, {
  credentials: 'include',
}).then((a) => a.json());

const post = (path, data) => fetch(`${path}`, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(data),
  headers: {
    'content-type': 'application/json',
  },
}).then((a) => a.json());

const remove = (path) => fetch(`${path}`, {
  credentials: 'include',
  method: 'DELETE',
}).then((a) => a.json());

export default {
  get,
  post,
  remove,
};
