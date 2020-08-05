/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const {
  override,
  disableEsLint,
  addBabelPlugins,
  addExternalBabelPlugin,
  overrideDevServer,
} = require('customize-cra');

module.exports = {
  webpack: override(
    // disableEsLint(),
    // ...addBabelPlugins('styled-jsx/babel'),
    addExternalBabelPlugin('styled-jsx/babel')
  ),
  devServer(configFunction) {
    // eslint-disable-next-line func-names
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      // Default config: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpackDevServer.config.js
      const config = configFunction(proxy, allowedHost);

      // Set loose allow origin header to prevent CORS issues
      config.headers = {
        // 'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      };

      return config;
    };
  },
};
