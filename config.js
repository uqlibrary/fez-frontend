// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: (branch) => (`https://development.library.uq.edu.au/espace/${branch}`),
        api: 'https://api.library.uq.edu.au/staging/',
        gtm: 'GTM-K597ZS',
        title: 'eSpace - The University of Queensland (DEVELOPMENT)',
        titleSuffix: 'Development',
        environment: 'development',
        basePath: 'espace/', // updated in webpack
        publicPath: '',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX',
        googleMaps: 'key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&'
    },
    staging: {
        url: () => ('https://fez-staging.library.uq.edu.au/'),
        api: 'https://api.library.uq.edu.au/staging/',
        gtm: 'GTM-K597ZS',
        title: 'eSpace - The University of Queensland (STAGING)',
        titleSuffix: 'Staging',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX',
        googleMaps: 'key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&'
    },
    production: {
        url: () => ('https://espace.library.uq.edu.au/'),
        api: 'https://api.library.uq.edu.au/v1/',
        gtm: 'GTM-T4NPC25',
        title: 'eSpace - The University of Queensland',
        titleSuffix: 'BETA',
        environment: 'production',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://orcid.org',
        orcidClientId: 'APP-UIQ1ZTKAU17ZGZSC',
        googleMaps: 'key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&'
    }
};

exports.default = deployment;


