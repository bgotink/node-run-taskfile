import {dirname, join} from 'path';

import findPackages from './find-package-json';

const NODE_BIN = join('node_modules', '.bin');

export default async function getPath(directory?: string): Promise<string[]> {
  let paths: string[] = [];

  for
    await(let pkg of findPackages(directory)) {
      paths.push(join(dirname(pkg.__path), NODE_BIN));
    }

  return paths;
}
