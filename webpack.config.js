const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackTemplate = require("html-webpack-template");

module.exports = {
    entry: {
        index: "./src/index.js",
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
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname, "src/loaders")],
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
                },
            },
            {
                test: /\.(txt)$/,
                use: {
                    loader: "ref-loader",
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
};
