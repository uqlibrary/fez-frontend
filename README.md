# Fez frontend

[ ![Codeship Status for uqlibrary/fez-frontend](https://app.codeship.com/projects/5f018a50-f4f8-0134-5dd6-4eabb52e4bf9/status?branch=master)](https://app.codeship.com/projects/141087)
[![Dependency Status](https://david-dm.org/uqlibrary/fez-frontend.svg)](https://david-dm.org/uqlibrary/fez-frontend)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/fez-frontend/dev-status.svg)](https://david-dm.org/uqlibrary/fez-frontend)

Fez frontend is a web interface application for digital repository.

UQ's branding for Fez is UQ eSpace.

- legacy eSpace application https://espace.library.uq.edu.au/
- current build https://development.library.uq.edu.au/espace/master (or your feature branch)


## Technology
- Code: `React (~0.15), Javascript (ES2015 - Babel), Immutable, SASS`
- State: `Redux, ReduxForm`
- Design: `Google Material Design - Material UI`
- Build and dev tools: `Webpack`
- Unit tests: `Jest`
- E2E tests: TBA

## Development
This project is using `yarn` for dependency management.  Make sure `yarn` is installed on your machine.
- `npm install yarn -g` - install `yarn` globally
- `yarn`
- `find node_modules/ -type f -name .babelrc | grep -v packager | xargs rm -rf` - because https://github.com/okonet/react-dropzone/issues/383#issuecomment-303554125 - may be fixed by babel 7.
- `yarn start` - The website is now running on `http://localhost:3000/` on dev api (requires additional setup of uqlibrary/api project)
- `yarn start:mock` - The website is now running on `http://localhost:3000/` on mock data
- for Hot Reloading to work in IntelliJ products, turn "safe write" off in the settings
- `yarn start:build` will run production build version on `http://dev-espace.library.uq.edu.au:9000/` and `http://localhost:9000` (add `dev-espace.library.uq.edu.au` to your /etc/hosts)
- `yarn start:build:e2e` will run production build version on `http://localhost:9000` with mock data

Mock data is provided for all pages and actions under `src/mock/`.

### Development notes

#### Naming conventions

- React components and files of components and related files (eg scss) are to be named with upper case (eg MenuDrawer.js). Do not add UQ, UQLibrary or similar prefixes to components
- Other files are to be named with lower case (eg index.js, reducerX.js)
- *Actions methods naming*: use [verb][Noun] format (if appropriate), eg loadAuthorsList, updateAuthor, createRecord. Actions are not directly related to api calls, don't name actions after API verbs, eg patch/get/put/etc
- *Action types naming*: use [NOUN]_[VERB] format, eg PUBLICATION_TYPE_SELECTED to indicate that action X was performed on an object Y. Use standard action types names:
  - [NOUN]_LOADING
  - [NOUN]_LOADED
  - [NOUN]_FAILED
  - [NOUN]_SHOW
  - [NOUN]_HIDE
  - etc
- *Action transformers naming*: use [verb][Noun] format (if appropriate) to indicate what method returns, eg unclaimRecordContributorsIdSearchKey(), getRecordContributorsIdSearchKey(), etc


#### Optimisation

to keep initial load to a minimum following optimisation has been added to the project:

- Async (lazy) loading of non-essential (essential components are only those components user can see on public pages when not authenticated)
- Splitting essential vendor libraries out ('react', 'react-dom', 'react-router-dom', 'redux', 'react-redux') - those libraries do not change often and will be cached by the browser
- Optimise rendering of the components (in ReactJs 15 use react-addon-perf) to minimize wasteful rendering of components, implement PureComponent or shouldComponentUpdate()
- Locale package is split into smaller chunks to avoid loading it all at once:
   - publicationForm.js locale is loaded only when PublicationForm component is loaded
   - other locale files are not too big, all bundled into one for now
- webpack plugins:
   
  - uglify/tree shake:

```
new UglifyJsPlugin({sourceMap: true})
```

  - minify in deployment:

```
new webpack.DefinePlugin({
  __DEVELOPMENT__: !process.env.CI_BRANCH,                    // always production build on CI
  'process.env.NODE_ENV': JSON.stringify('production'),       // always production build on CI
  ...
  })
```
 
  - remove momentjs locale:

```  
new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
```  

#### Optimisation Guidelines

- do not use functional components
- try to simplify props
- component should extend React.PureComponent if props are simple 
- component should extend React.Component, shouldComponentUpdate() should be implemented if props have objects
- import explicit and specific components (do not import all):
   - *DO NOT* `import {HelpIcon} from 'uqlibrary-react-toolbox';` 
   - *DO* `import {HelpIcon} from 'uqlibrary-react-toolbox/build/HelpDrawer';`
- any set of components which is not required in the initial load, eg PublicationForm, FixForm, ClaimForm etc, should lazy loaded using `<Async>`
```
const PublicationsList = (componentProps) => (<Async load={import('modules/SharedComponents/PublicationsList/components/PublicationsList')}  componentProps={componentProps} />);
...
<PublicationsList {...props} />
```
- make sure to check BundleAnalyzerPlugin output locally by running `npm run build` or `npm run analyse`: 
  - main-###.js file should not exceed 1Mb
  - main-###.js should not include any non-essential libraries

#### Exception handling
- any custom reject() by promises should return an object with status and message defined `{status: 401, message: 'Unauthorised user'}` [Example](https://github.com/uqlibrary/fez-frontend/blob/5b77d698065ddbff6f8ffcd31cf95ffcacd6f16b/src/repositories/account.js#L13)
- any custom catch() methods of promises should process known errors and throw other errors. [Example](https://github.com/uqlibrary/fez-frontend/blob/5b77d698065ddbff6f8ffcd31cf95ffcacd6f16b/src/modules/App/actions.js#L27)

## Testing

### Unit testing

Jest is used as testing tool for unit tests. Any HTMl markup is to be tested with snapshots.

- install jest `npm install jest -g`
- run tests `npm test`

Before committing changes, locally run tests and update stapshots (if required). To update snapshots run `npm test -- -u`.

### E2E testing
TBA

## Mocking

To run website on mock data run `yarn start:mock` webserver will start on `http://localhost:3000/`

The project allows the user to "login" as any test user. Simply add `?user=<username>` to the request and it will log you
in as that user. Usernames can be found in the `src/mock/data/accounts.js` file.

- anonymous user: http://localhost:3000/?user=anon#/
- researcher user: http://localhost:3000/?user=uqresearcher#/
- researcher user without orcid: http://localhost:3000/?user=noorcid#/
- staff/not author user: http://localhost:3000/?user=uqstaff#/
- undegrad student user: http://localhost:3000/?user=s1111111#/
- postgrad student user: http://localhost:3000/?user=s2222222#/
- user with expired token: http://localhost:3000/?user=uqexpired#/

## Deployment
Application deployment is 100% automated using Codeship, and is hosted in S3. 
All deployment configuration (S3 bucket access keys, post deployment cache invalidation configuration) is stored within Codeship.
Deployment pipelines are setup for branches: "master", "staging, "production" and any branch starting with "feature-".

- Deployments to production are hosted on https://espace.library.uq.edu.au/
- Deployments to staging are hosted on https://fez-staging.library.uq.edu.au/
- All other branches are deployed on https://development.library.uq.edu/espace/`branchName`/.

Staging/production build has routing based on `createBrowserHistory()`, other branches rely on `createHashHistory()` due to URL/Cloudfront restrictions

## Google Analytics integration

Fez-frontend includes GTM (Google Tag Manager). GTM is set at webpack build time in webpack configuration.
It can be setup as an environmental variable at CI level if required.

GTM is very flexible and easy to configure to track required events. See more details on [Google Analytics](https://www.google.com.au/analytics/tag-manager/)

