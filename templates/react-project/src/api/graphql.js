import _ from 'lodash';

export default (payload) => fetch('/api', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    query: payload,
  }),
})
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject();
    }
    return res.json();
  })
  .then((res) => {
    if (res.errors) {
      return Promise.reject(new Error(_.get(res.errors, '0.message')));
    }
    return res.data;
  });
