module.exports = {
  entry: "./static/src/main.js",
  output: {
    path: "./static/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: "vue" },
    ]
  },
  devtool: 'source-map'
}