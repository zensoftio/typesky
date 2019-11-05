module.exports = {
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/entities/**",
    "!src/model/**/assembly.ts",
    "!src/model/**/storage.ts",
    "!src/enum/**",
  ],
  "roots": [
    "<rootDir>/src",
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
  },
  "testMatch": [
    "<rootDir>/src/**/*.{spec,test}.{ts,tsx}",
  ],
  "setupFilesAfterEnv": ["<rootDir>/src/configs/setupEnzyme.ts"],
  "testEnvironment": "jest-environment-jsdom-fourteen",
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  "moduleNameMapper": {
    "@App/(.*)$": "<rootDir>/src/$1",
    "@Scenes/(.*)$": "<rootDir>/src/kit/scenes/$1",
    "@Components/(.*)$": "<rootDir>/src/kit/components/$1",
    "@Modules/(.*)$": "<rootDir>/src/kit/modules/$1",
    "@Services": "<rootDir>/src/model/services/index",
    "@Mappers": "<rootDir>/src/model/mappers/index",
    "@Storages": "<rootDir>/src/model/storages/index",
    "@Entities/(.*)$": "<rootDir>/src/entities/$1",
    "@Const/(.*)$": "<rootDir>/src/const/$1",
    "@Types": "<rootDir>/src/common/types",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.worker.entry.js": "<rootDir>/__mocks__/workerMock.js",
  },
};
