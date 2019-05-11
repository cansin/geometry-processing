const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTemplate = require("html-webpack-template");
const path = require("path");

module.exports = {
    entry: {
        index: "./src/index.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(jpg|off|obj)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[ext]",
                    },
                },
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                    },
                ],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    output: {
        path: path.resolve(__dirname, "build"),
    },
    plugins: [
        new CleanWebpackPlugin(["build/*"]),
        new HtmlWebpackPlugin({
            inject: false,
            template: HtmlWebpackTemplate,
            favicon: "favicon.ico",
            links: [
                "https://fonts.googleapis.com/css?family=Roboto:300,400,500",
                "https://fonts.googleapis.com/icon?family=Material+Icons",
            ],
            title: "Cansin Yildiz - CENG 789 - Digital Geometry Processing - Assignments",
            xhtml: true,
            appMountId: "app",
        }),
    ],
    resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname, "src/loaders")],
    },
};
