const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
console.log('输出路径', path.resolve(__dirname, `../dist/${process.env.ENV_other ? `${process.env.ENV_other}/` : ''}${process.env.ENV_file}`))
module.exports = {
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextPlugin('style/[name]_main[hash].css'),
        // new CleanWebpackPlugin([`../dist/${process.env.ENV_file}`],
        //     {
        //         allowExternal: true //允许删除根目录以外的文件夹
        //     }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, `../src/${process.env.ENV_other ? `other/${process.env.ENV_other}/` : ''}${process.env.ENV_file}/static`)
        }]),
    ],
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.css$|\.styl/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    // use: ["css-loader", 'postcss-loader']
                    use: [{
                            loader: 'css-loader',
                        }, {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'stylus-loader'
                        }
                    ]
                }),
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|dependencies)/,
                use: [{
                        loader: 'babel-loader',
                    },
                    {
                        loader: path.resolve("./inject-loader.js") // 开发模式使用注入代码实现html热更新
                    }
                ]
            }

        ]
    },
    output: {
        path: path.resolve(__dirname, `../dist/${process.env.ENV_other ? `${process.env.ENV_other}/` : ''}${process.env.ENV_file}`),
        filename: './js/[name].bundle[hash].js',
        chunkFilename: './js/[name].[chunkhash:3].js'
    }
};