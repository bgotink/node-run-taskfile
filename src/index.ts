import {dirname, join} from 'path';

import findPackages from './find-package-json';

const NODE_BIN = join('node_modules', '.bin');

/* istanbul ignore next */
if (!('asyncIterator' in Symbol)) {
  (Symbol as any).asyncIterator = Symbol.for('Symbol.asyncIterator');
}

export default async function getPath(directory?: string): Promise<string[]> {
  let paths: string[] = [];

  for
    await(let pkg of findPackages(directory)) {
      paths.push(join(dirname(pkg.__path), NODE_BIN));
    }

  return paths;
}
