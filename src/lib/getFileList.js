const path = require('path');
const fs = require('fs');

const getFileList = (pathname) => {
  const stats = fs.statSync(pathname);
  if (!stats.isDirectory()) {
    return [pathname];
  }
  const fileList = fs.readdirSync(pathname);
  const len = fileList.length;
  const result = [];
  for (let i = 0; i < len; i++) {
    const fileItem = fileList[i];
    result.push(...getFileList(path.join(pathname, fileItem)));
  }
  return result;
};

module.exports = getFileList;
