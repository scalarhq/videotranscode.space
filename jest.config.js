module.exports = {
  transform: {
    "^.+\\.svelte$": "svelte-jester",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js", "svelte", "ts"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
