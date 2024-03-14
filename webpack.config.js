module.exports = {
    // Other webpack configuration options...
    module: {
        rules: [
            {
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto',
            },
        ],
    },
};
