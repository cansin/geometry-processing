const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.js",
    },
    plugins: [
        new CleanWebpackPlugin(["build/*"]),
        new HtmlWebpackPlugin({
            title: "CENG 789 - Digital Geometry Processing - Assignment I",
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.(off|obj)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {},
                    },
                ],
            },
        ],
    },
};
