module.exports = {
  entry: "./static/src/main.js",
  output: {
    path: "./static/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: "vue" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  },
  devtool: 'source-map'
}