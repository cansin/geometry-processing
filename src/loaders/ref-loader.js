module.exports = function (content) {
    this.cacheable();

    const result = content.split("\n").map(function (e) {
        return e.split(/ +/).filter(Boolean).map(Number).reverse();
    });

    return `export default new Map(${JSON.stringify(result)});`;
};
