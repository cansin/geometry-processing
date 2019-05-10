module.exports = function(content) {
    this.cacheable();

    const result = content.split("\n").map(function(e) {
        return e
            .split(/ +/)
            .filter(Boolean)
            .map(Number)
            .reverse();
    });

    return `module.exports = new Map(${JSON.stringify(result)});`;
};
