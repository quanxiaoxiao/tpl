import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import * as Diff from 'diff';
import chalk from 'chalk';
import { fetchData } from '@quanxiaoxiao/about-http';
import shelljs from 'shelljs';
import {
  defer,
  from,
} from 'rxjs';
import {
  map,
  concatMap,
  filter,
  tap,
} from 'rxjs/operators';
import config from './config.mjs';

export default () => {
  const target = resolve(process.cwd(), config.configName);
  if (!shelljs.test('-f', target)) {
    console.error(`config \`${target}\` is not found`);
    process.exit(1);
  }
  const { resources, url } = JSON.parse(readFileSync(target));
  from(Object.entries(resources))
    .pipe(
      map(([filename, resource]) => ({
        name: filename,
        resource,
      })),
      concatMap((obj) => defer(async () => {
        const origin = await fetchData({
          url: `${url.replace(/{{[^}]+}}/, obj.resource)}`,
          match: (statusCode) => statusCode === 200,
        });
        const raw = readFileSync(resolve(process.cwd(), obj.name));
        const diff = Diff.diffLines(raw.toString(), origin.toString());
        return {
          name: obj.name,
          raw,
          origin,
          diff,
        };
      })),
      filter((obj) => obj.diff.length > 1),
      tap((obj) => {
        writeFileSync(resolve(process.cwd(), obj.name), obj.origin);
      }),
      map((obj) => {
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
        return {
          name: obj.name,
          modifies,
        };
      }),
    )
    .subscribe((ret) => {
      Object
        .keys(ret.modifies)
        .forEach((lineNumer) => {
          const item = ret.modifies[lineNumer];
          console.log(`${chalk.magenta(`@ ${ret.name}:${lineNumer} @`)}`);
          if (item.pre != null) {
            console.log(item.pre);
          }

          item.list.forEach((d) => {
            if (d.removed) {
              console.log(`${chalk.red(d.value.replace(/^\n|\n$/g, ''))}`);
            }
            if (d.added) {
              console.log(`${chalk.green(d.value.replace(/^\n|\n$/g, ''))}`);
            }
          });

          if (item.next != null) {
            console.log(item.next);
          }
        });
      console.log('');
    });
};
