/* eslint no-param-reassign: 0 */

const merge = (origin, values) => {
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[key];
    const type = typeof value;
    if (origin[key] == null) {
      origin[key] = type === 'object' ? {} : value;
    } else if (type === 'string') {
      origin[key] = value;
    } else if (type === 'object') {
      merge(origin[key], value);
    }
  }
};

export default merge;
