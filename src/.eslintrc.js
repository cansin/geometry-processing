module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["plugin:react/recommended", "prettier/react"],
    parser: "babel-eslint",
    parserOptions: {
        sourceType: "module",
    },
    plugins: ["babel", "import"],
    rules: {
        "import/order": ["error", { "newlines-between": "always" }],
        "no-console": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
