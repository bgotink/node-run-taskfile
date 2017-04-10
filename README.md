# node-run-taskfile

The `run-taskfile` package exposes a `run` command which you can use in your run-scripts. It uses a
`Taskfile`, cf. [@adriancooney/Taskfile](https://github.com/adriancooney/Taskfile). The `run` script
supports nested packages by adding all `node_modules/.bin` folders up the directory tree to the `PATH`.
With this set-up, it is possible to e.g. add multiple packages to a monorepository but use one
installation of `typescript`, `karma`, `ava`&hellip; in the repository root.

## License

Copyright &copy; 2017 Bram Gotink, licensed under the MIT license.
