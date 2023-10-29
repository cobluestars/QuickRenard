const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML 파일을 처리하기 위한 플러그인

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        },
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: 'ts-loader'
        }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']   
  },
  devtool: 'source-map', // 소스맵 활용
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [ // 플러그인 섹션
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

