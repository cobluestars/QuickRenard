const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  plugins: [
    new LodashModuleReplacementPlugin
    ({
      'collections': true,
      'paths': true
    })
  ],
  entry: './src/QuickRenard.ts', // 진입점 파일을 QuickRenard.ts로 변경
  output: {
    filename: 'QuickRenard.js', // 출력 파일 이름
    path: path.resolve(__dirname, 'dist'), // 출력 경로
    library: 'QuickRenard', // 라이브러리 이름
    libraryTarget: 'umd', // Universal Module Definition
    globalObject: 'this' // 글로벌 객체 설정
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
  devtool: 'source-map' // 소스 맵 옵션 활성화
};
