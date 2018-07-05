// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: (branch) => (`https://development.library.uq.edu.au/espace/${branch}`),
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://fez-staging.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-K597ZS',
        title: 'UQ eSpace (DEVELOPMENT)',
        short_name: 'eSpace',
        titleSuffix: 'Development',
        environment: 'development',
        basePath: 'espace/', // updated in webpack
        publicPath: '',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX',
        googleMaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&v=3.exp&libraries=geometry,drawing,places'
    },
    staging: {
        url: () => ('https://fez-staging.library.uq.edu.au/'),
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://fez-staging.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-K597ZS',
        title: 'UQ eSpace (STAGING)',
        short_name: 'eSpace',
        titleSuffix: 'Staging',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX',
        googleMaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&v=3.exp&libraries=geometry,drawing,places'
    },
    production: {
        url: () => ('https://espace.library.uq.edu.au/'),
        api: 'https://api.library.uq.edu.au/v1/',
        auth_login: 'https://espace.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-T4NPC25',
        title: 'UQ eSpace',
        short_name: 'eSpace',
        titleSuffix: '',
        environment: 'production',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://orcid.org',
        orcidClientId: 'APP-UIQ1ZTKAU17ZGZSC',
        googleMaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&v=3.exp&libraries=geometry,drawing,places'
    }
};

exports.default = deployment;


