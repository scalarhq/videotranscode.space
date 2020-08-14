module.exports = {
  // transform: {
  //   '^.+\\.ts$': 'ts-jest',
  //   '^.+\\.js$': 'babel-jest',
  // },
  // moduleDirectories: ['node_modules', 'src'],
  // testPathIgnorePatterns: ['node_modules'],
  // bail: false,
  // verbose: true,
  // // preset: 'jest-puppeteer',
  // transformIgnorePatterns: ['node_modules'],
  // moduleFileExtensions: ['tsx', 'ts', 'js', 'jsx'],
  setupFilesAfterEnv: ['./jest.setup.js', '@testing-library/jest-dom/extend-expect'],
};
