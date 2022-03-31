module.exports = {
    server: {
        baseDir: '.',
        routes: {
            '/node_modules': 'node_modules',
            '/abi': 'eth-contracts/build/contracts',
        },
        middleware: {
        // overrides the second middleware default with new settings
            1: require('connect-history-api-fallback')({
                index: '/dapp/index.html', 
                htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
            })
        }
    }
}