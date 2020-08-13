/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (env) => {
  return {
    target: 'node',
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: path.resolve(__dirname, './src/server.ts'),
    },
    output: {
      path: path.resolve(__dirname, `./dist/server`),
      filename: 'server.js',
    },
    node: {
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        esmodules: true,
                      },
                      useBuiltIns: undefined,
                    },
                  ],
                  '@babel/preset-react',
                ],
                plugins: ['@loadable/babel-plugin']
              },
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, './tsconfig.json'),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        'global.__BUILD_DATE__': JSON.stringify(new Date().toISOString()),
      }),
    ],
    resolve: {
      alias: {
        // There should be only one react and react-dom copy as it causes issue with hooks
        // https://fb.me/react-invalid-hook-call
        // react: path.resolve(__dirname, '../../node_modules/react'),
        // 'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      },
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
    },
    externals: [
      // 'react',
      // 'react-dom',
      nodeExternals(),
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../../node_modules'),
      }),
    ],
  };
};
