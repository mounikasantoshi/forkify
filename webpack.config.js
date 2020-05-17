const path = require('path');
const HtmlWebpackPlugin= require('html-webpack-plugin');

module.exports={
    entry:['./src/index.js'],
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'js/main.js',
    
    },
    devServer: {
        contentBase:'./dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_module/,
                use:{
                    loader: 'babel-loader'
                } 
            }
        ]
    }
};
