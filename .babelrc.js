module.exports = {
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
    ],
    presets: ["@babel/preset-env", "@babel/preset-react"],
};
