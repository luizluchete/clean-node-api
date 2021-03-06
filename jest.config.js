module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.ts',
  //   '!<rootDir>/src/**/*-protocols.ts'
  // ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/test/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.*\\.ts$': 'ts-jest'
  }
}
