const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML 파일을 처리하기 위한 플러그인

module.exports = {
  entry: './src/index.js', // 진입점 파일 설정
  output: {
    filename: 'bundle.js', // 출력 파일 이름
    path: path.resolve(__dirname, 'dist') // 출력 경로
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'] // Babel 설정
                }
            }
        },
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: 'ts-loader' // TypeScript 설정
        }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']   // 처리할 파일 확장자 목록
  },
  devtool: 'source-map', // 소스 맵 옵션 활성화
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [ 
    new HtmlWebpackPlugin({
      template: './src/index.html' // HTML 템플릿 위치
    })
  ]
};