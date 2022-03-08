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

  return Array.from(new Set(result)).map((s) => (s === '@emotion' ? '@emotion/eslint-plugin' : s));
};
