const {
  preprocess: makeTsPreprocess,
  createEnv,
  readConfigFile,
} = require("@pyoner/svelte-ts-preprocess");

const env = createEnv();
const compilerOptions = readConfigFile(env);
const preprocessOptions = {
  env,
  compilerOptions: {
    ...compilerOptions,
    allowNonTsExtensions: true,
  },
};
const preprocess = makeTsPreprocess(preprocessOptions);

module.exports = {
  transform: {
    "^.+\\.svelte$": [
      "jest-transform-svelte",
      { preprocess: preprocess, debug: true },
    ],
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["node_modules"],
  bail: false,
  verbose: true,
  transformIgnorePatterns: ["node_modules"],
  moduleFileExtensions: ["js", "svelte", "ts"],
  setupFilesAfterEnv: [
    "./jest.setup.js",
    "@testing-library/jest-dom/extend-expect",
  ],
};
