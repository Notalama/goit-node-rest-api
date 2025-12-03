export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "services/**/*.js",
    "!**/node_modules/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
