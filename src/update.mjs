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
        obj.diff.forEach((d, i) => {
          if (d.removed || d.added) {
            console.log(`${chalk.magenta(`@ ${obj.name}:${obj.diff.slice(0, i).filter((dd) => !dd.removed && !dd.added).reduce((acc, cur) => acc + cur.count, 0)} @`)}`);
            if (i !== 0) {
              const prev = obj.diff[i - 1];
              if (!prev.removed && !prev.added) {
                const matchs = prev.value.replace(/\n+$/, '').match(/\n(.+)$/);
                if (matchs) {
                  console.log(matchs[1]);
                }
              }
            }
            if (d.removed) {
              console.log(`${chalk.red(d.value.replace(/^\n|\n$/, ''))}`);
            }
            if (d.added) {
              console.log(`${chalk.green(d.value.replace(/^\n|\n$/, ''))}`);
            }
            const next = obj.diff[i + 1];
            if (next && !next.removed && !next.added) {
              const matchs = next.value.replace(/^\n+/, '').match(/^[^\n]+/);
              if (matchs) {
                console.log(matchs[0]);
              }
            }
            console.log('');
          }
        });
      }),
      tap((obj) => {
        writeFileSync(resolve(process.cwd(), obj.name), obj.origin);
      }),
    )
    .subscribe(() => {
      process.exit(0);
    });
};
