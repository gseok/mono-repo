const path = require('path');
const webpack = require('webpack');

const LoadablePlugin = require('@loadable/webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

const autoprefixer = require('autoprefixer');
const packageJSON = require('./package.json');

const rootPath = path.resolve(__dirname, '..', '..');
const DEFAULT_MODE = 'development';
const PRODUCTION_MODE = 'production';

const getConfigClient = (target, env) => {
  const pkgName = packageJSON.name
    .split('-')
    .map((key) => `${key.charAt(0).toUpperCase()}${key.substr(1)}`)
    .join('');
  const pkgVersion = packageJSON.version;
  const outputFileName = `${pkgName}_${pkgVersion}.js`;
  const outputStyleFileName = `${pkgName}_${pkgVersion}.css`;
  const clientEntry =
    target === 'node' ? [path.resolve(__dirname, './src/App.tsx')] : [path.resolve(__dirname, `./src/index.tsx`)];

  const base = {
    target,
    name: target,

    mode: DEFAULT_MODE,
    devtool: 'source-map',
    node: {
      fs: 'empty',
    },

    entry: clientEntry,
    output: {
      path: path.resolve(rootPath, `dist/${packageJSON.name}`, target),
      publicPath: '/',
      filename: outputFileName,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
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
                        browsers: ['last 2 versions', 'ie >= 8'],
                      },
                      debug: false,
                      useBuiltIns: 'usage',
                      corejs: { version: 3, proposals: true },
                    },
                  ],
                  '@babel/preset-react',
                  '@babel/preset-typescript'
                ],
                plugins: ['@loadable/babel-plugin']
              },
            },
            // {
            //   loader: 'ts-loader',
            //   options: {
            //     configFile: path.resolve(__dirname, './tsconfig.json'),
            //   },
            // },
          ].filter((data) => !!data),
        },
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'css-loader',
              options: { importLoaders: 1, modules: true },
            }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
            {
              loader: 'postcss-loader', // postcss-loader 추가
              options: {
                ident: 'postcss',
                plugins: () => [
                  autoprefixer({
                    // browsers: ['last 2 versions', "Edge > 0", "ie >= 8"],
                  }),
                ],
              },
            },
            { loader: 'resolve-url-loader' },
            { loader: 'sass-loader' }, // to convert SASS to CSS
          ],
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({ filename: outputStyleFileName }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'index.html'),
      }),
      new LoadablePlugin(),
    ],

    resolve: {
      alias: {
        // There should be only one react and react-dom copy as it causes issue with hooks
        // https://fb.me/react-invalid-hook-call
        'react': path.resolve(__dirname, '../../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      },
      extensions: ['.js', 'jsx', '.ts', '.tsx', '.css', '.scss'],
    },
  };

  return {
    ...base,
    devServer: {
      publicPath: '/',
      public: 'local-sloop.map.naver.com:1226',
      port: 1226,
      hot: true,
      open: true,
      inline: true,
      writeToDisk: true,
      disableHostCheck: true,
      historyApiFallback: true,
    },
  };
};

const getConfigServer = (env) => {
  return {
    target: 'node',
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: path.resolve(__dirname, '../pkg-server/src/server.ts'),
    },
    output: {
      path: path.resolve(__dirname, `../pkg-server/dist/server`),
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
                  '@babel/preset-typescript'
                ],
                plugins: ['@loadable/babel-plugin']
              },
            },
            // {
            //   loader: 'ts-loader',
            //   options: {
            //     configFile: path.resolve(__dirname, './tsconfig.json'),
            //   },
            // },
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
        'react': path.resolve(__dirname, '../../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      },
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
    },
    externals: [
      // 'react',
      // 'react-dom',
      // nodeExternals(),
    ],
  };
}

module.exports = (env) => {
  return [
    getConfigClient('web', env),
    getConfigClient('node', env),
    getConfigServer(env)
  ];
};
