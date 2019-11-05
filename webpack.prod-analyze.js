process.env.BUNDLE_ANALYZE = true;
const config = require('./webpack.prod');
const webpack = require('webpack');
const compiler = webpack(config);
const isAnalyze = !!process.env.BUNDLE_ANALYZE;
const chalk = require('chalk');

const buildingMessage = `
${chalk.default.yellow.bold(` Creating an optimized production build ${isAnalyze && 'with analyze ' || ''}...`)}
`;

const getMessage = (name, stats) => `
${chalk.default.green(` Total ${name}: `) + chalk.default.blue(stats[name].length)}
  `;

const analyzerMessage = `${
chalk.default.gray.bold(' Bundle Analyzer is running, see statistic at: ') +
chalk.default.blueBright.underline('http://127.0.0.1:8888')}

${chalk.default.gray(`Press ${chalk.default.white('"Ctrl + C"')} to exit.`)}
`;

console.log(buildingMessage);

compiler.run((error, stats) => {

  if (error) {
    throw new Error(error);
  }

  stats = stats.toJson();

  console.log(`${chalk.default.green.bold('\nAnalyze successful!')}`);
  console.log(getMessage('assets', stats), getMessage('chunks', stats), getMessage('modules', stats));
  isAnalyze && console.log(analyzerMessage);
});