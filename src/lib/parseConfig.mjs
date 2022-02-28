import { resolve } from 'node:path';

const walk = (obj, arr) => {
  const result = [];
  const names = Object.keys(obj);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (obj[name] == null) {
      result.push({
        name,
        navList: arr,
        path: resolve(process.cwd(), ...arr, name),
        resource: null,
      });
    } else if (typeof obj[name] === 'string') {
      result.push({
        name,
        navList: arr,
        path: resolve(process.cwd(), ...arr, name),
        resource: obj[name],
      });
    } else {
      result.push(...walk(obj[name], [...arr, name]));
    }
  }
  return result;
};

export default (resources) => walk(resources, []);
