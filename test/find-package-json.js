import test from 'ava';
import {join} from 'path';
import findPackages from '../lib/find-package-json';

const cwd = process.cwd();

const FIXTURE_ROOT = join(__dirname, '_fixtures');

test.beforeEach(() => {
  process.chdir(cwd);
});

if (!('asyncIterator' in Symbol)) {
  Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
}

test('it should list the package.jsons', async (t) => {
  const iterator = findPackages(FIXTURE_ROOT);

  let current = await iterator.next();

  t.false(current.done);
  t.deepEqual(current.value, {__path: join(FIXTURE_ROOT, 'package.json'), name: 'fixture-root'});

  while (!(current = await iterator.next()).done) {
    t.not(current.value.__path.indexOf(FIXTURE_ROOT), 0);
  }
});

test('it should list the package.jsons for process.cwd() if no directory is given', async (t) => {
  process.chdir(FIXTURE_ROOT);
  const iterator = findPackages();

  let current = await iterator.next();

  t.false(current.done);
  t.deepEqual(current.value, {__path: join(FIXTURE_ROOT, 'package.json'), name: 'fixture-root'});

  while (!(current = await iterator.next()).done) {
    t.not(current.value.__path.indexOf(FIXTURE_ROOT), 0);
  }
});

test('it should list nested package.jsons in the correct order', async (t) => {
  const iterator = findPackages(join(FIXTURE_ROOT, 'subfolder', 'subsubfolder'));

  let current = await iterator.next();

  t.false(current.done);
  t.deepEqual(current.value, {
    __path: join(FIXTURE_ROOT, 'subfolder', 'subsubfolder', 'package.json'),
    name: 'some-subpackage'
  });

  current = await iterator.next();

  t.false(current.done);
  t.deepEqual(current.value, {__path: join(FIXTURE_ROOT, 'package.json'), name: 'fixture-root'});

  while (!(current = await iterator.next()).done) {
    t.not(current.value.__path.indexOf(FIXTURE_ROOT), 0);
  }
});
