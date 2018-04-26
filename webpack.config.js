//basic vars
const path = require('path');
const webpack = require('webpack');

//additional plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const ExtractTextPlugin = require('extract-text-webpack-plugin');

let isProduction = (process.env.NODE_ENV === 'production');

//module settings
module.exports = {
    mode: (isProduction) ? 'production' : 'development', //development, production, none

    //базовый путь к проекту
    context: path.resolve(__dirname, 'src'),

    //точки входа js
    entry: {
        //основной файл приложения
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },

    //путь для собранных файлов
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '../'
    },

    //devServer configuration
    devServer: {
        contentBase: './dist',
        publicPath: '/dist/',
        host: '0.0.0.0',
        port: 9000
    },

    devtool: (isProduction) ? '' : 'inline-source-map',

    module: {
        rules: [

            //JS
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'env'
                    }
                }
            },

            //SCSS
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {sourceMap: true}
                        },
                        {
                            loader: 'postcss-loader',
                            options: {sourceMap: true}
                        },
                        {
                            loader: 'sass-loader',
                            options: {sourceMap: true}
                        },
                    ],
                    fallback: 'style-loader',
                })
            },

            //Images
            {
                test: /\.(png|gif|jpe?g)$/,
                loaders: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                    'img-loader',
                ],
            },

            //Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ]
            },

            //SVG
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
            },

            //HTML
            /*{
                test: /\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ]
            },*/
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            // $: 'jquery',
        }),
        new ExtractTextPlugin(
            {
                filename: './css/[name].css'
            }
        ),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([
                {
                    from: './img',
                    to: 'img'
                },
                {
                    from: './favicon',
                    to: 'favicon'
                },
                {
                    from: './*.html',
                    to: './'
                },
            ],
            {
                ignore: [{
                    glob: 'svg/*'
                }]
            }),
    ],
};

//PRODUCTION ONLY
// console.log(isProduction);

if (isProduction) {
    console.log('------ Production --------');

    module.exports.plugins.push(
        new UglifyJSPlugin({
            sourceMap: true
        }),
    );

    module.exports.plugins.push(
        new ImageminPlugin({
            test: /\.(png|gif|jpe?g|svg)$/i
        }),
    );

    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    );
}