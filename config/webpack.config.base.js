const webpack = require('webpack');
const { resolve } = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const ROOT_PATH = resolve(__dirname);
const BASE_PATH = resolve(ROOT_PATH, '../src');
const BUILD_PATH = resolve(ROOT_PATH, '../build');

const commonExtract = new MiniCssExtractPlugin({
  filename: devMode ? 'assets/[name].bundle.css' : 'assets/[name].bundle.css?v=[contenthash:5]'
});

exports.baseConfig = {
  entry: {
    vendor: [BASE_PATH]
  },
  output: {
    publicPath: '/',
    path: BUILD_PATH
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: false,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        },
        modules: {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules',
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: {
                localIdentName: '[local]'
              }
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
        include: resolve(BASE_PATH, 'fonts/'),
        loader: 'file-loader',
        options: {
          limit: 1024,
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'astroturf/loader']
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', 'svg-react-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        // section to check source files, not modified by other loaders
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [BASE_PATH, 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '~containers': resolve(BASE_PATH, 'containers/'),
      '~components': resolve(BASE_PATH, 'components/'),
      '~common': resolve(BASE_PATH, 'common/'),
      '~store': resolve(BASE_PATH, 'store/'),
      '~utils': resolve(BASE_PATH, 'utils/')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new HtmlwebpackPlugin({
      template: 'src/index.html',
      chunks: ['vendor'],
      // inject: false,
      // process: devMode,
      minify: !devMode
        ? {
            removeAttributeQuotes: true,
            // removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: !devMode,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyURLs: true
          }
        : ''
    }),
    commonExtract,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),
    new StyleLintPlugin({
      configFile: 'package.json'
    })
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    hotOnly: true,
    contentBase: BASE_PATH,
    disableHostCheck: true,
    compress: true,
    port: 3005,
    host: '0.0.0.0',
    open: true,
    historyApiFallback: {
      disableDotRule: true
    },
    proxy: {
      '/graphql/proxy': {
        target: 'https://graphql.org/swapi-graphql',
        pathRewrite: { '^/graphql/proxy': '' },
        changeOrigin: true
      }
    }
  }
};
