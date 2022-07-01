# Fez frontend

[![AWS Codebuild Status for uqlibrary/fez-frontend](https://codebuild.ap-southeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoidS80NCs2UmNpVHdKc3Q2RVpoK2w0NlZ0d1ZlRGMrZDFUNDZFUTZZUEdrQ0NTY1N4RGdHNEtDaUxZY3RsdVlWTEJQZUFQaWh5LzBDUDNBU3VicXNFaC84PSIsIml2UGFyYW1ldGVyU3BlYyI6IkdKeUVUVVpubk56NDBjVHEiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend-master/view?region=ap-southeast-2)
[![Dependency Status](https://david-dm.org/uqlibrary/fez-frontend.svg)](https://david-dm.org/uqlibrary/fez-frontend)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/fez-frontend/dev-status.svg)](https://david-dm.org/uqlibrary/fez-frontend)

Fez frontend is a web interface application for digital repository.
[Staging/Production release notes](https://libnet.library.uq.edu.au/display/LIB/eSpace+UI+Release+Notes)

UQ's branding for Fez is UQ eSpace.

- Legacy eSpace application <https://espace.library.uq.edu.au/>
- eSpace production <https://espace.library.uq.edu.au/dashboard>
- eSpace staging <https://fez-staging.library.uq.edu.au/dashboard>
- eSpace prodtest <https://fez-testing.library.uq.edu.au/dashboard> (see notes below)
- Current build <https://development.library.uq.edu.au/espace/master> (or your feature branch)

### IMPORTANT NOTE

**eSpace prodtest is a production environment**

This means that it's exactly like production, except for the git branch that uses. This is useful for **carefully*** testing anything that might break production before pushing to the actual branch.

***carefully**: any actions (e.g. creating, editing, deleting records) performed in eSpace prodtest will result in changes to production. This includes **email notifications, 3rd party services integrations and everything else**

## Technology

- Code: `React (~16.8), Javascript (ES2015 - Babel), Immutable, SASS`
- State: `Redux, ReduxForm`
- Design: `Google Material Design` - [Material UI](https://v4.material-ui.com/components/app-bar)
- Build and dev tools: `Webpack`
- Unit tests: `Jest`
- E2E tests: `Cypress`
- [Supported Browsers](https://web.library.uq.edu.au/site-information/web-browser-compatibility)

## Development

- This project uses `npm` for dependency management. Make sure `npm` is installed on your machine by following the instructions at <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm>

- This project uses `nvm` for `node` version switching. To install or update `node`, run one of the installation commands detailed at <https://github.com/nvm-sh/nvm#install--update-script>. For example: 
   
   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
- The `nvm` installation process will update your environmental variables. You will either need to restart your terminal for the changes to take effect, or run the `export` command shown at the end of the `nvm` installation process. For example (using the curl command above):
   
   ```
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
   ```
- With `nvm` installed and/or updated, install `node` version of at least 16.13.2:

   ```
   nvm install 16.13.2 
   ```

- Switch to the `node` version just installed and begin initial setup:
  ```
  nvm use 16.13.2 && npm i -g npm@8.4 jest webpack-dev-server
  ```
  See [gotchas](#gotchas) below for watchouts regarding `nvm` versions
  
  
- In the root folder of `fez-frontend` install the required `npm` modules:

   ```
   npm install
   ```

- Finally, before starting one of the `npm run` commands shown below, ensure you have duplicated the `example.env` file in the root of `fez-frontend` and named the duplicate file `.env`

You should now be able to run one of the following commands from the CLI:

- `npm ci` - when weird errors happen your local npm probably doesnt match the latest project requirements, this
  clears & reinstalls npm packages
- `npm run start`
  - runs <http://localhost:3000/>
  - uses dev api for backend (<http://dev-api.library.uq.edu.au:8050/>) (requires additional setup of uqlibrary/api
    project)
- `npm run start:mock`
  - runs <http://localhost:3000/>
  - uses mock data from src/mock
- `npm run start:url`
  - runs <http://dev-espace.library.uq.edu.au:3000/> (add `LOCAL-IP dev-espace.library.uq.edu.au` to your /etc/hosts)
      e.g. 192.168.1.104 dev-epacellibrary.uq.edu.au
  - uses **staging** api as a backend (you will need to set API_URL in .env to `https://api.library.uq.edu.au/staging/`)
    - you will need to launch the browser with CORS disabled:
      
      On Linux:
      ```sh
      google-chrome --disable-web-security --user-data-dir=/tmp/chrome-dev
      ```
      On Mac:
      ```sh
      open -na Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
      ```
      On Windows:
      ```sh
      "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:/ChromeDevSession"
      ```
  - add UQLID and UQLID_USER_GROUP cookies for logged-in users (values can be found under Developer Tools -> Application Tab -> Cookies after logging into <https://www.library.uq.edu.au/>)
  - for Hot Reloading to work in IntelliJ products, turn ["safe write"](https://www.jetbrains.com/help/phpstorm/system-settings.html#f1e47e50) off in the settings
- `npm run start:build`
  - runs production build version on <http://dev-espace.library.uq.edu.au:9000/> and `http://localhost:9000/`
  - To use prod's api, change config.json -> deployment.development.api key value to <https://api.library.uq.edu.au/v1/> and re-run
- `npm run start:build:e2e`
  - runs production build version on <http://localhost:9000/>
  - uses mock data from src/mock
  - async loading is not working since chunks are not saved, navigate directly to required routes
- `npm run test:cs`
  - Runs Prettier and ESLint checks on all Javascript files in the project, then lists files with code style issues. Check the other npm scripts for ways to fix the issues automatically if possible.
- `npm run test:e2e:cc`
  - Runs Cypress tests with code coverage checks. HTML report will be available under `coverage/cypress` while and after tests run.

Mock data is provided for all pages and actions under `src/mock/`.

### Development notes

#### Git safety checks

- Run the following in the project root directory to install the pre-commit hook:

  ```sh
  ln -sf "../../scripts/pre-commit" ".git/hooks/pre-commit"
  ```

  It does two things:

  - Prevent direct commits to the staging branch.
  - Run `prettier-eslint` automatically before every local commit

- Run the following in the project root directory to prevent accidental merges from the staging branch:

  ```sh
    ln -sf "../../scripts/prepare-commit-msg" ".git/hooks/prepare-commit-msg"
  ```

#### Naming conventions

- React components and files of components and related files (eg scss) are to be named with upper case (eg
  MenuDrawer.js). Do not add UQ, UQLibrary or similar prefixes to components
- Other files are to be named with lower case (eg index.js, reducerX.js)

##### Action types naming conventions

- _Action transformers naming_: use [verb][noun] format (if appropriate) to indicate what method returns, eg
  unclaimRecordContributorsIdSearchKey(), getRecordContributorsIdSearchKey(), etc
- Keep to the following naming format `[OBJECT]_[STATUS]` or `[NOUN]_[VERB]`:

- LATEST_PUBLICATIONS_LOADING
- LATEST_PUBLICATIONS_LOADED
- LATEST_PUBLICATIONS_FAILED

or

- APP_ALERT_SHOW
- APP_ALERT_HIDE

#### Optimisation

To keep initial load to a minimum, the following optimisations have been added to the project:

- Async (lazy) loading of non-essential (essential components are only those components user can see on public pages
  when not authenticated)
- Splitting essential vendor libraries out ('react', 'react-dom', 'react-router-dom', 'redux', 'react-redux') - those
  libraries do not change often and will be cached by the browser
- Optimise rendering of the components (in ReactJs 15 use react-addon-perf) to minimize wasteful rendering of
  components, implement PureComponent or shouldComponentUpdate()
- Locale package is split into smaller chunks to avoid loading it all at once:
  - publicationForm.js locale is loaded only when PublicationForm component is loaded
  - Other locale files are not too big, all bundled into one for now

### Webpack

#### version: 4

##### Webpack plugins

- SplitChunksPlugin

  ```javascript
  optimization: {
        splitChunks: {
            automaticNameDelimiter: '-',
            cacheGroups: {
                commons: {
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                parallel: true
            })
        ]
    },
  ```

- Terser/tree shake: used with split chunks built-in plugin in webpack 4

  ```javascript
  new TerserPlugin({ sourceMap: true });
  ```

- minify in deployment:

  ```javascript
  new webpack.DefinePlugin({
    __DEVELOPMENT__: !process.env.CI_BRANCH,                    //  always production build on CI
    'process.env.NODE_ENV': JSON.stringify('production'),       //  always production build on CI
    ...
  })
  ```

- remove momentjs locale:

  ```javascript
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/);
  ```

### <a name="gotchas" id="gotchas"></a>Gotchas

- Because FE is served from cloudFront, add a behaviour to serve css/js filename patterns. E.g. behaviours have been
  added for `main-*` and `commons-*` files.
- if you can't get eg <https://fez-staging.library.uq.edu.au/view/UQ:e6c5854> to load the new FE (it always loads legacy) you can use the alternate url of <https://fez-staging.library.uq.edu.au/view_new/UQ:e6c5854>
- The eSpace API always returns a 200 for a GET request to /fez-author. For this reason, checking for the presence of the ```author``` (e.g. ```this.props.author```) is not enough to determine if the logged-in user is an author or not. This can be done the following check: ```this.props.autho?.aut_id``` or by checking for the response of author details API endpoint e.g. ```this.props.authorDetails```
- Be aware that `nvm` will use the default version of node whenever a new terminal window is opened. This may catch you out if you are updating environmental variables and closing/opening Terminal as mentioned earlier.
  
  To check what version is in use:
  ```
  nvm ls
  ```
  
  will display similair to:
  
  ```
  v14.7.0
  ->     v16.13.2
  default -> 14.7.0 (-> v14.7.0)
  iojs -> N/A (default)
  unstable -> N/A (default)
  node -> stable (-> v16.13.2) (default)
  stable -> 16.13 (-> v16.13.2) (default)
  lts/* -> lts/gallium (-> N/A)
  lts/argon -> v4.9.1 (-> N/A)
  lts/boron -> v6.17.1 (-> N/A)
  lts/carbon -> v8.17.0 (-> N/A)
  lts/dubnium -> v10.24.1 (-> N/A)
  lts/erbium -> v12.22.10 (-> N/A)
  lts/fermium -> v14.19.0 (-> N/A)
  lts/gallium -> v16.14.0 (-> N/A)
  ```
  
  **Note the default value above (14.7.0)**
  
  To ensure you're always using the correct version of Node, you can set the default nvm will use with:
  
  ```
  nvm alias default 16.13.2
  ```
  
  which when checked should give you something like this:
  
  ```
  nvm ls
  
  v14.7.0
  ->     v16.13.2
  default -> 16.13.2 (-> v16.13.2)
  iojs -> N/A (default)
  unstable -> N/A (default)
  node -> stable (-> v16.13.2) (default)
  stable -> 16.13 (-> v16.13.2) (default)
  lts/* -> lts/gallium (-> N/A)
  lts/argon -> v4.9.1 (-> N/A)
  lts/boron -> v6.17.1 (-> N/A)
  lts/carbon -> v8.17.0 (-> N/A)
  lts/dubnium -> v10.24.1 (-> N/A)
  lts/erbium -> v12.22.10 (-> N/A)
  lts/fermium -> v14.19.0 (-> N/A)
  lts/gallium -> v16.14.0 (-> N/A)
  ```
  
  Be sure to check your nvm node version if your unit tests fail to run (this typically will happen if you change your repo from package-lock.json version 1 to 2, including updating the node and npm versions as mentioned above).

- If you wish to reference static images in the `public/images` folder outside of `src`, you must use `require()` to bring them in to your component. This is due to a hashing process during build that moves and renames images to an assets folder on S3.

So instead of:

``` 
<img src='/images/someimage.jpg'>
```

use:

``` 
const myImage = require(../../public/images/someimage.jpg) // your path with depend upon where you're referencing the image in the hierarchy
<img src={myImage}>
// or in styles
backgroundImage: `url(${myImage})`
```

Also be wary of the different environments your code will deploy to, e.g. dev branch, staging, production. Dev branches work slightly different to the other two when it comes to using absolute vs relative paths within IMG elements, due to how the dev server must host multiple branches each with their own build (note this is not an issue if using the image in a style, as shown above).
Typically for localhost, staging and production you'll need to reference your image from the root, by adding a leading `\`. However, this **won't** work on the development server, which requires an image reference *without* the leading slash.
To handle this, use the `IS_DEVELOPMENT_SERVER` constant in `src/config/general.js` to conditionally add a leading `\` when you output your image path, or leverage the convenience function `getRequiredImagePath`:

```
const myImagePath = `${!IS_DEVELOPMENT_SERVER ? '/' : ''}${myImage}`;

//or

const myImagePath = getRequiredImagePath(myImage);
```

### Optimisation Guidelines

- do not use functional components
- try to simplify props
- component should extend React.PureComponent if props are simple
- component should extend React.Component, shouldComponentUpdate() should be implemented if props have objects
- import explicit and specific components (do not import all):
  - _DO NOT_ `import { Button } from 'material-ui';`
  - _DO_ `import { Button } from 'material-ui/Button';`
- any set of components which is not required in the initial load, eg PublicationForm, FixForm, ClaimForm etc, should
  lazy loaded using `<Async>`

  ```jsx
  const PublicationsList = (componentProps) => (<Async load={import ('modules/SharedComponents/PublicationsList/components/PublicationsLis t')}  componentProps={componentProps} />);
  ...
  <PublicationsList {...props} />
  ```

- make sure to check BundleAnalyzerPlugin output locally by running `npm run build` or `npm run analyse`:
  - main-###.js file should not exceed 1Mb
  - main-###.js should not include any non-essential libraries

### Exception handling

- any custom reject() by promises should return an object with status and message defined
  `{status: 401, message: 'Unauthorised user'}`
  [Example](https://github.com/uqlibrary/fez-frontend/blob/5b77d698065ddbff6f8ffcd31cf95ffcacd6f16b/src/repositories/account.js#L13)
- any custom catch() methods of promises should process known errors and throw other errors.
  [Example](https://github.com/uqlibrary/fez-frontend/blob/5b77d698065ddbff6f8ffcd31cf95ffcacd6f16b/src/modules/App/actions.js#L27)

## Testing

### Unit testing

Jest is used as testing tool for unit tests. Any HTMl markup is to be tested with snapshots.

- install jest `npm install jest -g`
- run tests `npm test`

Before committing changes, locally run tests and update snapshots (if required). To update snapshots run
`npm run test:unit:update`.

[Code coverage](coverage/jest/index.html) is available (after running `npm test`)

#### Guidelines

- [Action creators](https://github.com/uqlibrary/fez-frontend/blob/master/src/actions/README.md#testing)
- [Rendered components](https://github.com/uqlibrary/fez-frontend/blob/master/src/modules/README.md#testing)
- [Reducers](https://github.com/uqlibrary/fez-frontend/blob/master/src/reducers/README.md#testing)

### E2E testing

We are using [Cypress](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file) for
our e2e UI testing.

**NOTE**: If you are getting an error `Failed to deserialize the V8 snapshot blob` when running tests - be sure to delete your cypress cache - Windows: `\AppData\Local\Cypress\Cache`

To run tests, first start the build, using mock data, ie `npm run start:mock`

Then:

- use `npm run cypress:run`
- or to open the Cypress UI use `npm run cypress:open`
- or to watch the tests `npm run cypress:watch`.

Before pushing to a branch make sure to run `npm run test:all`. This runs the unit and cypress tests.

Codebuild runs `npm run test:e2e:dashboard` as it spins up a webpack-dev-server and serves the frontend with mock data to run tests for now until we have API integration with docker, but only in `master` branch.

You can watch video recordings of any failed test runs and view some debug messages via the [Cypress dashboard](https://dashboard.cypress.io/projects/mvfnrv/runs). We have open-source license which allows unlimited runs.

To manage the account, the admin username/pass is in PasswordState under "GitHub Cypress.io Admin User" (login to Github as this user, then use the github account to log into Cypress).

If you want Codebuild to run cypress tests before you merge to master, include the text `cypress` in the branch name and push and cypress tests will be run on that branch (set up in bin/codebuild-test.sh).

#### Standardised selectors to target elements

- We are following the best practice recommended by cypress to target elements using `data-testid` attribute

- Please have a look at below table for some current examples in eSpace frontend:

| Element   | prop for ID               | ID attached to native elements for targetting                   |
| --------- | ------------------------- | --------------------------------------------------------------- |
| TextField | `textFieldId="rek-title"` | `<input id="rek-title-input"/>` `<label id="rek-title-label"/>` |

#### Some tricks and tips

- When simulating clicks which result in non-trivial DOM changes, you might need to `cy.wait(1000);` to wait 1 second after the click before posing any expectations. If possible, use `cy.waitUntil()` instead to wait for a particular condition to be true.
- Custom cypress commands can be added to `cypress/support` to abstract out common actions. For example:

  - When the form you are writing tests for has a browser alert box to prevent navigating away before its complete, add this to the top of your test to unbind the unload event handler. The issue might only present itself when trying to do another test by navigating to a new url, which never finishes loading because the browser is waiting for the alert from the previous page to be dismissed, which is actually not visible in Cypress UI!

    ```javascript
    afterEach(() => {
      cy.killWindowUnloadHandler();
    });
    ```

  - When using the MUI dialog confirmation, use the following for navigating to the homepage:

    ```javascript
    cy.navToHomeFromMenu(locale);
    ```

    where `locale` is:

    ```javascript
    {
      confirmationTitle: '(Title of the confirmation dialogue)',
      confirmButtonLabel: '(Text of the "Yes" button)'
    }
    ```

    See `cypress/support/commands.js` to see how that works.

- If a test occasionally fails as "requires a DOM element." add a `.should()` test after the `.get()`, to make it wait for the element to appear (`.should()` loops)

#### Gotchas

When running ```npm test``` and related scripts natively in linux (without using a VM), jest can be quite demanding making the OS unresponsive.

One way to avoid this is to restrict the number of CPU cores through jest's [--maxWorkers](https://jestjs.io/docs/cli#--maxworkersnumstring) option.

```bash
NODE_ENV=test FULL_PATH=http://localhost node --expose-gc ./node_modules/.bin/jest --logHeapUsage --maxWorkers=50%
```

## Mocking

To run website on mock data run `npm run start:mock` webserver will start on `http://localhost:3000/`

The project allows the user to "login" as any test user. Simply add `?user=<username>` to the request and it will log
you in as that user. Usernames can be found in the `src/mock/data/accounts.js` file.

- anonymous user: <http://localhost:3000/?user=anon>
- researcher user: <http://localhost:3000/?user=uqresearcher>
- researcher user without orcid: <http://localhost:3000/?user=uqnoauthid>
- staff/not author user (has admin): <http://localhost:3000/?user=uqstaff>
- undegrad student user: <http://localhost:3000/?user=s1111111>
- postgrad student user: <http://localhost:3000/?user=s2222222>
- RHD submission form: <http://localhost:3000/rhdsubmission?user=s2222222>
- user with expired token: <http://localhost:3000/?user=uqexpired>
- user who has readonly masquerade (but not admin): <http://localhost:3000/?user=uqmasquerade>
- user who can do CSV Ingest: <http://localhost:3000/?user=digiteamMember>

So an example staff link for an example admin edit page will be <http://localhost:3000/admin/edit/UQ:358319?user=uqstaff>

The following access is required:

| User type          | masquerade | admin | Resulting access                               |
| ------------------ | ---------- | ----- | ---------------------------------------------- |
| general user       | false      | false | no masquerade, no admin, no csv ingest         |
| support staff      | readonly   | false | readonly masquerade, no admin, no csv ingest   |
| admin or developer | full       | true  | full masquerade, admin, csv ingest             |
| digiteam           | false      | true  | no masquerade, admin (side effect), csv ingest |

masquerade - on account record (CURRENT_ACCOUNT_API) eg <https://api.library.uq.edu.au/staging/account>, canMasquerade = true or false; when true, masqueradeType = full or readonly

admin - on author record (AUTHOR_DETAILS_API) eg <https://api.library.uq.edu.au/staging/authors/details/uqldegro>, is_administrator = 0 or 1

(there is also is_super_administrator, 0 or 1, which gives access to the security tab)

## Reviewing

A Self-review checklist is [here](https://docs.google.com/document/d/1RTW8gdNcgZC4dNiHV3IeMcZkECftFqQ-3RLqyV8ieSw) in
the ISRS Collection.

Ask for review from team-mates if you'd like other eyes on your changes.

## Deployment

Application deployment is 100% automated (except for prodtest) using AWS Codebuild (and Codepipeline), and is hosted in S3. All testing and deployment commands and configuration are stored in the buildspec yaml files in the repo. All secrets (access keys and tokens for PT, Cypress, Sentry and Google) are stored in AWS Parameter Store, and then populated into ENV variables in those buildspec yaml files. 
Deployment pipelines are setup for branches: "master", "staging", "prodtest", "production" and several key branches starting with "feature-".

- Master branch is always deployed to staging/production
- Deployments to production are hosted on <https://espace.library.uq.edu.au/>
- Deployments to staging are hosted on <https://fez-staging.library.uq.edu.au/>
- Deployments to prodtest are hosted on <https://fez-testing.library.uq.edu.au/>
- All other branches are deployed on <https://development.library.uq.edu/espace/branchName/>.

Staging/production/prodtest build has routing based on `createBrowserHistory()`, other branches rely on `createHashHistory()` due
to URL/Cloudfront restrictions

Should you need to find your feature branch files on S3, they are [here](https://s3.console.aws.amazon.com/s3/buckets/uql-dev-frontend?region=ap-southeast-2&prefix=espace/&showversions=false) (most common use is to cleanup after you finish with a feature branch: remove the S3 sub-folder from this location, the git branch, and the AWS pipeline).

Note: prodtest requires a manual click for its deployment to happen: go to [this](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend-prodtest/view?region=ap-southeast-2) link and click the orange release changes button.

### Gotchas

There are some build steps that are exclusive to master, staging and production branches:
- npm run test:unit:ci1
- npm run test:e2e:dashboard

This means that even when a given branch passes tests and builds successfully in CB, it doesn't necessary mean that it's free issues.

In order to identify possible issues before pushing master upstream, make sure to run the commands above locally after merging your changes to that branch.

For more details, look at ./bin/codebuild-test.sh

## Google Analytics integration

Fez-frontend includes GTM (Google Tag Manager). GTM is set at webpack build time in webpack configuration. It can be
setup as an environmental variable at CI level if required.

GTM is very flexible and easy to configure to track required events. See more details on
[Google Analytics](https://www.google.com.au/analytics/tag-manager/)
