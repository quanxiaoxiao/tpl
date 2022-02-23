import chalk from 'chalk';

export default (obj) => {
  const modifies = {
  };
  for (let i = 0; i < obj.diff.length; i++) {
    const item = obj.diff[i];
    if (item.removed || item.added) {
      const lineNumer = obj
        .diff
        .slice(0, i).filter((dd) => !dd.removed && !dd.added)
        .reduce((acc, cur) => acc + cur.count, 0);
      if (!modifies[lineNumer]) {
        modifies[lineNumer] = {
          pre: null,
          next: null,
          list: [],
        };
        const prevs = obj.diff.slice(0, i).filter((d) => !d.removed && !d.added);
        if (prevs.length > 0) {
          const prev = prevs[prevs.length - 1];
          const lines = prev.value.replace(/^\n|\n$/g, '').split('\n');
          if (lines.length > 0) {
            modifies[lineNumer].pre = lines[lines.length - 1];
          }
        }
        const next = obj.diff.slice(i + 1).find((d) => !d.removed && !d.added);
        if (next) {
          const lines = next.value.replace(/^\n|\n$/g, '').split('\n');
          if (lines.length > 0) {
            modifies[lineNumer].next = lines[0]; // eslint-disable-line prefer-destructuring
          }
        }
      }
      modifies[lineNumer].list.push({
        removed: item.removed,
        added: item.added,
        value: item.value,
      });
    }
  }
  Object
    .keys(modifies)
    .forEach((lineNumer) => {
      const item = modifies[lineNumer];
      console.log(`${chalk.magenta(`@ ${obj.name}:${lineNumer} @`)}`);
      if (item.pre != null) {
        console.log(item.pre);
      }

      item.list.forEach((d) => {
        if (d.added) {
          console.log(`${chalk.green(d.value.replace(/^\n|\n$/g, ''))}`);
        }
        if (d.removed) {
          console.log(`${chalk.red(d.value.replace(/^\n|\n$/g, ''))}`);
        }
      });

      if (item.next != null) {
        console.log(item.next);
      }
    });
  console.log('');
};
