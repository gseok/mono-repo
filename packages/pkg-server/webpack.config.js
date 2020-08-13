/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const DotEnvPlugin = require('dotenv-webpack');
const dotEnv = require('dotenv').config();

module.exports = (env) => {
  const { NODE_ENV, GENERATE_SOURCEMAP, PHASE } = {
    ...dotEnv.parsed,
    ...env,
  };
  return {
    target: 'node',
    mode: NODE_ENV || 'development',
    devtool: GENERATE_SOURCEMAP || '',
    entry: {
      index: path.resolve(__dirname, './src/server.ts'),
    },
    output: {
      path: path.resolve(__dirname, `./dist`),
      filename: '[name].js',
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
              },
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, './tsconfig.json'),
              },
            },
            {
              loader: 'webpack-strip-block',
              options:
                PHASE === 'real'
                  ? {
                      start: 'develblock:start',
                      end: 'develblock:end',
                    }
                  : {},
            },
          ],
        },
      ],
    },
    plugins: [
      new DotEnvPlugin(),
      new CleanWebpackPlugin(),
      new DefinePlugin({
        'global.__BUILD_DATE__': JSON.stringify(new Date().toISOString()),
      }),
    ],
    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
    },
    externals: [
      nodeExternals(),
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../../node_modules'),
      }),
    ],
  };
};
