// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: 'https://development.library.uq.edu.au/',
        api: 'https://api.library.uq.edu.au/staging/',
        title: 'eSpace - The University of Queensland (DEVELOPMENT)',
        environment: 'development',
        basePath: 'espace/', // updated in webpack
        publicPath: '',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX'
    },
    staging: {
        url: 'https://fez-staging.library.uq.edu.au/',
        api: 'https://api.library.uq.edu.au/staging/',
        title: 'eSpace - The University of Queensland (STAGING)',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX'
    },
    production: {
        url: 'https://espace.library.uq.edu.au/',
        api: 'https://api.library.uq.edu.au/v1/',
        gtm: 'GTM-T4NPC25',
        title: 'eSpace - The University of Queensland',
        environment: 'production',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://orcid.org',
        orcidClientId: 'APP-UIQ1ZTKAU17ZGZSC'
    }
};

exports.default = deployment;


