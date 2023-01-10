# referenced from [TypeFox/monaco-languageclient](https://github.com/TypeFox/monaco-languageclient)

Set up steps:

```
// use node version 16.11.0 or above, recommended 16.13.0
npm i
npm run build:client



// to run backend node server
npm run start:example:server


// to start frontend server
npm run dev

// use react client example, for testing suggestions

```
update file path for react app:

To make suggestions work update the file path for  `hello world.java` in `packages/examples/react-client/src/main.tsx` with local absolute path, as observed the suggestions are working only for local system.

## OS check:

update this configuration of java as per your OS in the `packages/examples/server/src/java-server-launcher.ts` file
```js
"-configuration",
`${jdtPath}/jdt-language-server-1.9.0-202203031534/config_linux`,
// For windows, use ./config_win. For mac/OS X, use ./config_mac
```