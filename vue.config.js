const path = require("path");

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === "development") {
      return {
        watch: true,
        watchOptions: {
          aggregateTimeout: 200,
          poll: true,
          ignored: /node_modules/
        },
        stats: {
          colors: true,
          chunks: false
        },
        devServer: {
          contentBase: path.resolve("./build"),
          compress: false,
          port: 9000,
          hot: true,
          clientLogLevel: "debug",
          host: "localhost"
        },
        optimization: {
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false
        },
        externals: {
          moment: "Moment"
        }
      };
    } else {
      return {
        devServer: {
          contentBase: path.resolve("./dist"),
          compress: true,
          port: 8080,
          clientLogLevel: "silent"
        },
        externals: {
          moment: "Moment"
        }
      };
    }
  }
};
