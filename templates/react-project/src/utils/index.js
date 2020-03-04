export const numberToFixed = (a = 0, size = 1) => parseFloat(Number(a).toFixed(size));

export const deg2Radian = (degree) => degree * Math.PI / 180;

export const formatNumber = (num) => {
  const [, integer, decimal = ''] = `${num}`.match(/^(\d+)(\.\d+)?$/);
  const integerFormat = integer.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,');
  if (decimal !== '') {
    return `${integerFormat}${decimal}`;
  }
  return integerFormat;
};

export const escapeString = (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

export const numberToSize = (num) => {
  const n = parseInt(num, 10);
  const sizes = ['', 'K', 'M', 'B'];
  if (n === 0) {
    return '0';
  }
  const i = parseInt(Math.floor(Math.log(n) / Math.log(1000)), 10);
  if (i === 0) { return `${n}`; }
  const unit = sizes[i];
  const [integer, digital] = (n / (1000 ** i)).toString().split('.');
  if (integer.length === 1 && digital) {
    return `${integer}.${digital.slice(0, 1)}${unit}`;
  }
  return `${integer}${unit}`;
};
