import shelljs from 'shelljs';

export default (buf) => {
  const result = [];
  const data = JSON.parse(buf);
  if (data.parser) {
    result.push(data.parser);
  }
  if (data.extends) {
    result.push(...Array.isArray(data.extends) ? data.extends : [data.extends]);
  }

  result.push(...data.plugins || []);

  if (result.find((s) => /airbnb/.test(s))) {
    const ret = shelljs.exec('npm info "eslint-config-airbnb@latest" peerDependencies', { silent: true });
    if (ret.code !== 0) {
      process.exit(1);
    }
    return result.concat(ret.stdout.match(/{([^}]+)}/)[1]
      .trim()
      .split('\n')
      .map((s) => s.trim())
      .map((s) => s.split(':')[0].trim())
      .map((s) => s.replace(/(^'|'$)/g, '')));
  }
  return result;
};
