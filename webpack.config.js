const path = require('path');

module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '', // Ajoutez cette ligne
    },
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'), // Utilisez 'static' au lieu de 'contentBase'
        port: 8080,
    },
};
