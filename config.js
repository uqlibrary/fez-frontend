// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: 'https://development.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/staging/',
        title: 'eSpace - The University of Queensland (DEVELOPMENT)',
        environment: 'development',
        publicPath: '',
        // publicPathOffline: '', - set in webpack
        basePath: 'https://development.library.uq.edu.au/', // updated in webpack
        baseUrlPath: 'https://development.library.uq.edu.au/' // updated in webpack
    },
    staging: {
        url: 'https://fez-staging.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/staging/',
        title: 'eSpace - The University of Queensland (STAGING)',
        environment: 'staging',
        publicPath: '/',
        publicPathOffline: '/',
        basePath: '',
        baseUrlPath: '/'
    },
    production: {
        url: 'https://espace.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/v1/',
        gtm: 'GTM-T4NPC25',
        title: 'eSpace - The University of Queensland',
        environment: 'production',
        publicPathOffline: '/',
        publicPath: '/',
        basePath: '',
        baseUrlPath: '/'
    }
};

exports.default = deployment;


