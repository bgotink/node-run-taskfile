import {readFile, stat} from 'fs';
import {dirname, join, resolve} from 'path';

const FILENAME = 'package.json';

async function readJson<T>(path: string): Promise<T> {
  return new Promise<string>((resolve, reject) => {
           readFile(path, (error, content) => {
             /* istanbul ignore if */
             if (error) {
               return reject(error);
             }

             resolve(content.toString());
           });
         })
      .then(content => JSON.parse(content));
}

function isRoot(path: string): boolean {
  return dirname(path) === path;
}

async function exists(path: string):
    Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        stat(path, (err, stats) => {
          /* istanbul ignore if */
          if (err && err.code !== 'ENOENT') {
            return reject(err);
          }

          resolve(!err && stats.isFile());
        });
      })
    }

export interface PackageJson {
  name: string;
  version: string;
}

export interface Resolved { __path: string; }

export default async function*
    findPackageJson<T extends PackageJson>(directory: string = process.cwd()):
        AsyncIterableIterator<T&Resolved> {
  let currentDirectory: string = resolve(directory);

  while (!isRoot(currentDirectory)) {
    const file = join(currentDirectory, FILENAME);

    if (await exists(file)) {
      const content = await readJson<T&Resolved>(file);
      content.__path = file;

      yield content;
    }

    currentDirectory = dirname(currentDirectory);
  }
}
