import test from 'ava';
import {join} from 'path';

import getPath from '../lib';

const cwd = process.cwd();

const FIXTURE_ROOT = join(__dirname, '_fixtures');

test.beforeEach(() => {
  process.chdir(cwd);
});

test('it should return the path', async (t) => {
  const paths = await getPath(FIXTURE_ROOT);
  t.plan(paths.length + 1);

  t.true(paths.length > 1);

  t.is(paths[0], join(FIXTURE_ROOT, 'node_modules/.bin'));

  paths.slice(1).forEach(path => {
    t.not(path.indexOf(FIXTURE_ROOT), 0);
  });
});

test('it should return the path for process.cwd() if no directory is given', async (t) => {
  process.chdir(FIXTURE_ROOT);

  const paths = await getPath();
  t.plan(paths.length + 1);

  t.true(paths.length > 1);

  t.is(paths[0], join(FIXTURE_ROOT, 'node_modules', '.bin'));

  paths.slice(1).forEach(path => {
    t.not(path.indexOf(FIXTURE_ROOT), 0);
  });
});

test('it should return the path in the correct order', async (t) => {
  const paths = await getPath(join(FIXTURE_ROOT, 'subfolder', 'subsubfolder'));
  t.plan(paths.length + 1);

  t.true(paths.length > 2);

  t.is(paths[0], join(FIXTURE_ROOT, 'subfolder', 'subsubfolder', 'node_modules', '.bin'));
  t.is(paths[1], join(FIXTURE_ROOT, 'node_modules', '.bin'));

  paths.slice(2).forEach(path => {
    t.not(path.indexOf(FIXTURE_ROOT), 0);
  });
});
