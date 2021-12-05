const path = require('path');
const glob = require('glob');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: glob.sync('./src/**/*.js').reduce(function (obj, el) {
    const file = path.parse(el);
    obj[path.join(file.dir.substring(5), file.name)] = el;
    return obj;
  }, {}),
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    clean: true
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        "src/manifest.json",
        { from: "src/images", to: 'images' },
        { from: "src/popup", to: 'popup', filter: path => !path.endsWith('.js') },
      ],
    }),
  ]
}