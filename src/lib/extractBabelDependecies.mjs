export default (buf) => {
  const data = JSON.parse(buf);
  if (data.plugins) {
    return data.plugins;
  }
  return [];
};
