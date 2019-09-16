const path = require('path');

const root = path.resolve(__dirname, '..');
const resolveDir = dir => path.resolve(root, dir);

module.exports = {
  src: resolveDir('src'),
  output: resolveDir('dist')
};
