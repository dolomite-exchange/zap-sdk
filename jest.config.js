module.exports = {
  globalSetup: './__tests__/helpers/Setup.ts',
  roots: [
    '<rootDir>/__tests__',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '__tests__\\/.*\\.test\\.ts$',
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node',
  ],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
  testEnvironment: 'node',
  testTimeout: 100000,
  reporters: ['default', 'jest-junit'],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
};
