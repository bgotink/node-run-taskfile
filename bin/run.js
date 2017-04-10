#!/usr/bin/env node

const {delimiter} = require('path');
const {spawn} = require('child_process');

const {default: getPath} = require('../lib');

const {env} = process;

class ProcessError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.code = code;
  }
}

getPath()
    .then(bins => {
      return `${bins.join(delimiter)}${delimiter}${env.PATH}`;
    })
    .then(PATH => {return new Promise((resolve, reject) => {
            const child = spawn('./Taskfile', process.argv.slice(2), {
              env: Object.assign({}, env, {PATH}),
              stdio: [process.stdin, process.stdout, process.stderr],
              cwd: process.cwd(),
            });

            child.on('exit', (code, signal) => {
              if (signal) {
                return reject(new ProcessError(`Run: process killed with signal ${signal}`));
              }

              if (code !== 0) {
                reject(new ProcessError(`Run: process exited with code ${code}`, code));
              } else {
                resolve();
              }
            });
          })})
    .catch(e => {
      if (e && e instanceof ProcessError) {
        console.error(e.message);
        process.exit(e.code);
      }

      console.error(e && e.stack || e);
      process.exit(1);
    });
