/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const {
  override,
  disableEsLint,
  addBabelPlugins,
  addExternalBabelPlugin,
} = require('customize-cra');

module.exports = override(
  // disableEsLint(),
  // ...addBabelPlugins('styled-jsx/babel'),
  addExternalBabelPlugin('styled-jsx/babel')
);
