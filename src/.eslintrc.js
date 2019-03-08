module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["plugin:react/recommended", "prettier/react"],
    parserOptions: {
        sourceType: "module",
    },
    rules: {
        "no-console": "off",
    },
};
