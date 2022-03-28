const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, "src")],
  output: {
    path: path.join(__dirname, "prod/dapp"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.join(__dirname, "src/index.html")
    })
  ],
  resolve: {
    extensions: [".js"],
    fallback: { 
      "stream": require.resolve("stream-browserify"),
      "crypto": false,
      "assert": require.resolve("assert/"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "http": require.resolve("stream-http")
    }
  },
  // devServer: {
  //   contentBase: path.join(__dirname, "dapp"),
  //   port: 8000,
  //   stats: "minimal"
  // } 
  devServer: {
    // contentBase
    static : {
      directory : path.join(__dirname, "src/")
    },
    port: 8000,
    // publicPath
    // devMiddleware:{
    //    publicPath: "http://localhost:3001/",
    // },
    // hotOnly
    hot: "only",
  }
  
};

