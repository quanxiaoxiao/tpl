const extract = (arr) => arr.reduce((acc, cur) => {
  if (typeof cur === 'string') {
    return [...acc, cur];
  }
  return [...acc, ...cur.filter((s) => typeof s === 'string')];
}, []);

export default (buf) => {
  const data = JSON.parse(buf);
  const result = [];
  if (data.presets) {
    result.push(...extract(data.presets));
  }
  if (data.plugins) {
    result.push(...extract(data.plugins));
  }
  if (data.env && data.env.development && data.env.development.plugins) {
    result.push(...extract(data.env.development.plugins));
  }

  if (data.env && data.env.development && data.env.production.plugins) {
    result.push(...extract(data.env.production.plugins));
  }

  return Array
    .from(new Set(result))
    .filter((s) => s !== '@emotion')
    .map((s) => {
      if (s === 'transform-react-remove-prop-types') {
        return 'babel-plugin-transform-react-remove-prop-types';
      }
      if (s === 'react-hot-loader/babel') {
        return 'react-hot-loader';
      }
      return s;
    });
};
