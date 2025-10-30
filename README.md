# Fez frontend

[![AWS Codebuild Status for uqlibrary/fez-frontend](https://codebuild.ap-southeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoidS80NCs2UmNpVHdKc3Q2RVpoK2w0NlZ0d1ZlRGMrZDFUNDZFUTZZUEdrQ0NTY1N4RGdHNEtDaUxZY3RsdVlWTEJQZUFQaWh5LzBDUDNBU3VicXNFaC84PSIsIml2UGFyYW1ldGVyU3BlYyI6IkdKeUVUVVpubk56NDBjVHEiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend-master/view?region=ap-southeast-2)

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

- Code: `React (~20.11), Javascript (ES2015 - Babel), Immutable, SASS`
- State: `Redux, ReduxForm`
- Design: `Google Material Design` - [MUI 5](https://mui.com/material-ui) ([see notes below](#mui-v5-upgrade) on the upgrade to MUI 5)
- Build and dev tools: `Webpack`
- Unit tests: `Jest`
- E2E tests: `Playwright`
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
- With `nvm` installed and/or updated, install `node` version of at least 20.11.0:

   ```
   nvm install 20.11.0 
   ```

- Switch to the `node` version just installed and begin initial setup:
  ```
  nvm use 20.11.0 && npm i -g npm@10.4.0 jest webpack-dev-server
  ```
  See [gotchas](#gotchas) below for watchouts regarding `nvm` versions
  
- if you are on a Mac, ensure xcode with developer applications is installed
  
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
- `npm run start:url` to view local code against staging api

   setup steps:
    - update file /etc/hosts (sudo required)

      ensure `dev-espace.library.uq.edu.au` is set to your local IP, or add an entry for it:

      e.g. `172.16.0.20 dev-espace.library.uq.edu.au`
    - edit project file `.env`

      set API_URL to `https://api.library.uq.edu.au/staging/`
    - start the web server (previous steps must be done before this point)

      in the terminal, issue `npm run start:url`
    - launch your browser **with CORS disabled**:

      Linux: `google-chrome --disable-web-security --user-data-dir=/tmp/chrome-dev`

      Mac: `open -na Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`

      Windows:`"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:/ChromeDevSession"`
    - Supply user cookie values

      in CORS-disabled browser, 
      - visit library homepage <https://www.library.uq.edu.au/> 
      - log in, 
      - (or manually add UQLID and UQLID_USER_GROUP cookies for logged-in users - values can be found by logging into <https://www.library.uq.edu.au/>, then looking under Developer Tools -> Application Tab -> Cookies)
    - load site

      in CORS-disabled browser, visit <http://dev-espace.library.uq.edu.au:3000/> 
    - note: for Hot Reloading to work in IntelliJ products, turn ["safe write"](https://www.jetbrains.com/help/phpstorm/system-settings.html#f1e47e50) off in the settings
- `npm run start:build`
  - runs production build version on <http://dev-espace.library.uq.edu.au:9000/> and `http://localhost:9000/`
  - To use prod's api, change /config.js > deployment.development.api > to <https://api.library.uq.edu.au/v1/> and re-run
- `npm run start:build:e2e`
  - runs production build version on <http://localhost:9000/>
  - uses mock data from src/mock
  - async loading is not working since chunks are not saved, navigate directly to required routes
- `npm run test:cs`
  - Runs Prettier and ESLint checks on all Javascript files in the project, then lists files with code style issues. Check the other npm scripts for ways to fix the issues automatically if possible.
- `npm run test:e2e:cc`
  - Runs playwright tests with code coverage checks. HTML report will be available under `coverage/playwright` while and after tests run.

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

#### Reusable WebComponents

eSpace currently takes only Alerts from Reusable - at some point in the future we may upgrade to use the standard uq header.

Staging branch calls Reusable staging branch - all other branches call production Reusable, by default.

To use local reusable in your local dev, swap the value of reusablejs in webpack.config.js (and restart your npm sun start:mock)

### TypeScript Integration

TypeScript support has been added to enable a progressive migration from JavaScript, allowing both JavaScript and TypeScript code 
to coexist and work seamlessly together from a DX perspective.

To achieve this, the `fork-ts-checker-webpack-plugin` Webpack plugin has been added and configured to validate TypeScript files exclusively, raising errors for 
any syntax issues.

#### Tooling

`@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` have been added and configured alongside `prettier` to enable 
static type checking and consistent formatting for TypeScript files in IDEs.

Alternatively, the `npm run tsc` and `npm run tsc:watch` scripts can be used to validate TypeScript files from the command line.

#### Migrating JavaScript Code to TypeScript

The first step in migrating a JS file to TS is renaming its extension from `.js` to `.ts` or `.tsx` for 
components. This triggers the configured linters to check for type errors. Generally, TypeScript is effective at detecting 
and inferring types automatically when the code and JSDoc blocks are correct. However, after renaming the file, it's likely 
to encounter some type errors.

##### Fixing Type Errors

If type errors appear after renaming a JS file, they are usually legitimate issues. However, exceptions may occur 
if TypeScript fails to infer the correct type or due to misconfigured JSDoc blocks. Most of the time, resolving these errors 
involves fixing or refining **JSDoc comments**, especially for imports where the imported files will not be converted to 
TypeScript. In other cases, adding explicit type annotations will often highlight previously undetected issues in the code.

Variables holding non-primitive values will typically require type definitions, which can be addressed by creating TypeScript 
types or interfaces. As a rule of thumb, these should be defined at the start of the file. For shared or abstract types and interfaces, 
please place them in files under the `@types` folder in the project's root directory.

##### Type Casting

When TypeScript cannot infer a variable's type based on code or existing annotations, you can use **type casting** to enforce 
the intended type. However, type casting should only be used when you are absolutely certain that lacking proper type 
checking or conversion won't introduce bugs.

##### Ignoring Type Errors

The project is configured to raise errors for implicit `any` types. This is intentional, as using `any` effectively disables 
type checking and negates the benefits of TypeScript. We want to avoid this. In cases where resolving 
a type error is too complex, you can temporarily suppress it using `// @ts-ignore` comments.

##### Examples

Examples of files migrated to TypeScript include `FavouriteJournals.tsx` and `Doi.tsx`. For the latter, new types representing 
eSpace models have been added to the `@types` folder, providing type inference for variables holding eSpace API data.

#### Code Coverage

Code coverage for TypeScript files is generated in the same way as for JavaScript files from `jest` and `playwright` tests. However, 
a known `nyc` [bug](https://github.com/istanbuljs/nyc/issues/1302#issuecomment-961455318) may cause issues during the  
coverage report merging step of the deployment process. As a workaround, ensure full coverage is achieved by either `jest` or `playwright`
tests and add the file to the ignore list for the other tool in `package.json`.

### Webpack

#### version: 5

As of March 2023, Fez uses Webpack version 5. 

- Use of Asset Loader instead of File Loader when emitting assets. 
***Important*** Note that on dev branches (development.library.edu.au) any icons referenced from CSS (e.g. as background images) or images loaded in to components via an ```import``` statement ***will not appear in the web page***. This is due to the lengthy path structure of the URL on dev branches, and the inclusion of a hash (#). These assets are all generated in the the root ```/assets``` folder and will work as expected on staging and prod branches.

```{
    test: /\.(png|jp(e*)g|svg|gif)$/,
    type: 'asset/resource',
    generator: {
        publicPath: '/assets/',
        outputPath: 'assets/',
        filename: '[hash][ext]',
    },
},
```

- CSS and JS assets now reside in a subfolder with the Hash of the most current Git Commit. Filenames continue to include contentHash in the name (Note that CSS was moved from the root to a `frontend-css` folder.). 

```
output: {
      filename: `frontend-js/${currentCommitHash}/[name]-[contenthash].min.js`,
}
```

```
new MiniCssExtractPlugin({
            filename: `frontend-css/${currentCommitHash}/[name]-[contenthash].min.css`,
})
```

- See ```webpack-dist.config.js``` for details of the ```currentCommitHash``` variable and the ```outputLastCommitHashes``` function, which builds a ```hash.txt``` file that includes the last 20 commit hashes.

- The outputting of source-maps has been removed.

- The PWA package has been disabled as it no longer served a purpose.

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

### React StrictMode
At the time of writing, [StrictMode](https://react.dev/reference/react/StrictMode) has been enabled for a subset of components only. Redux Forms has been deprecated, causing StrictMode to output numerous console errors that can not be directly fixed. 

Since Redux Form is mostly used in admin pages, these routes and select others have been excluded from StrictMode until such time that Redux Form is replaced in the repo. Look to `src/modules/App/components/App.js` for the implementation of the ```StrictModeConditional``` HoC that enables this selective application of StrictMode.


### <a name="gotchas" id="gotchas"></a>Gotchas

- Because FE is served from cloudFront, add a behaviour to serve css/js filename patterns. e.g. behaviours have been
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

We use [Playwright](https://playwright.dev/docs/writing-tests) for our E2E testing.

To run tests, simply use `npm run test:e2e`.

To run all tests, including unit tests, use `npm run test:all`.\
Then, to generate a combined code coverage report, use `npm run cc:reportAll`.\
This workflow is useful for confidently pushing changes upstream.

#### Parallelism

E2E tests run in [parallel](https://playwright.dev/docs/test-parallel) by default. In CI, this also includes **horizontal parallelism**  
via test sharding, where they are split across independent CI steps to speed up execution.

Unfortunately, Playwright doesn't support splitting tests based on their estimated or historical runtime. For this reason,
to avoid test sharding imbalances, where one shard takes significantly longer than the others, please consider splitting 
lengthy tests into multiple smaller ones.

#### Debugging

By default, Playwright runs tests using a headless browser.
To visualize tests in the browser, use `npm run test:e2e:show [?spec file]`.\
This disables test parallelism for convenience.

Breakpoints are handy for pausing either the test execution (via IDE integration) or the code execution (via the `debugger` keyword or manual breakpoints).
PhpStorm provides seamless integration.

##### Failed tests

To debug a failed test, use:\
`npm run test:e2e:debug playwright/.results/.../trace.zip`\
This displays a storyline of the failed test using the [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer-intro),\
where all sorts of detailed inspections are possible - network, DOM elements, etc.

###### CI

The above also applies to tests that fail on CI. In this case, the trace files need to be downloaded locally first. They
are part of the artifacts uploaded to S3 as output of each test stage - please refer to the "Artifacts" section on
the "Build Details" tab. 

Instructions on how to download and use the trace files from failed tests on AWS can be found [in our Sharepoint developer docs](https://uq.sharepoint.com/:w:/r/teams/lbf4g4a1/LTSDevelopers%20Documents/How-to/Review%20failed%20AWS%20FE%20test.docx?d=wf59cd41009c94efd8492a59bd4a68df7&csf=1&web=1&e=aYBJlm)

#### Standardised selectors to target elements

- We are following the best practice recommended by playwright to target elements using `data-testid` attribute

- Please have a look at below table for some current examples in eSpace frontend:

| Element   | prop for ID               | ID attached to native elements for targeting                   |
| --------- | ------------------------- | ---------------------------------------------------------------|
| TextField | `textFieldId="rek-title"` | `<input id="rek-title-input"/>` `<label id="rek-title-label"/>`|

#### Gotchas

##### Unit tests
When running ```npm test``` and related scripts natively in linux (without using a VM), jest can be quite demanding making the OS unresponsive.
One way to avoid this is to restrict the number of CPU cores through jest's [--maxWorkers](https://jestjs.io/docs/cli#--maxworkersnumstring) option.

```bash
NODE_ENV=test FULL_PATH=http://localhost node --expose-gc ./node_modules/.bin/jest --logHeapUsage --maxWorkers=50%
```

##### E2E tests

Unlike Jest, Playwright test assertions are based on [actionability checks](https://playwright.dev/docs/actionability), 
which means they are not suitable for checking every possible state of a given component. For instance, if a component 
displays a loading message for async actions, and those actions complete too quickly, checking for the presence of the
loading message might fail.

For assertions like the above, Jest is a better fit, as it requires adding waits to ensure the test doesn't finish 
before the component reaches its final state.

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

Application deployment is 100% automated (except for prodtest) using AWS Codebuild (and Codepipeline), and is hosted in S3. All testing and deployment commands and configuration are stored in the buildspec yaml files in the repo. All secrets (access keys and tokens for PT, Sentry and Google) are stored in AWS Parameter Store, and then populated into ENV variables in those buildspec yaml files. 
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

## Google Analytics integration

Fez-frontend includes GTM (Google Tag Manager). GTM is set at webpack build time in webpack configuration. It can be
setup as an environmental variable at CI level if required.

GTM is very flexible and easy to configure to track required events. See more details on
[Google Analytics](https://www.google.com.au/analytics/tag-manager/)


## MUI v5 Upgrade
<mark>February 2023</mark>

The upgrade from Material-UI version 4 (MUI4) to MUI version 5 (MUI5) was completed in Feb 23, and with it game a few watchaouts for anyone repeating the process in the future as well as current devs working with the new library:

1. MUI5 has redefined the default responsive breakpoint values (https://mui.com/material-ui/customization/breakpoints/), and devs writing tests or making use of, for example `useMediaQuery`, should be aware of the new breakpoints and adjust code appropriately.
- MUI4 values (px): `xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920`
- MUI5 values (px): `xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536`
2. MUI5 deprecated the widely used `<Hidden>` component. For this migration, the new `sx` element property was used to replace `<Hidden>` in _most circumstances_. Using `sx` does, however, raise a few awareness points:
-  Code using `sx` for breakpoints will rely on the browser's CSS engine to determine when something is **visible or not**. This is in contrast to how `<Hidden>` was used in our codebase, which used JS to control **inserting or deleting** DOM elements.
- When writing tests you must bear in mind the above, because `JSDOM` <mark>does not</mark> support a fully fledged CSS engine (https://github.com/jsdom/jsdom/blob/8e3a568d504353270691b5955af505155ae368bf/lib/jsdom/level2/style.js#L17). This is particularly important when writing tests that wish to check if an element is visible or not based on, for example browser window width (i.e. responsive design). These tests, in conjunction with `sx`, **will fail** because all elements are always visible due to the lack of a CSS engine. The recommendation here is to move these sorts of tests in to a Playwright spec, where you can assuredly test for element visibility using, for example `to.be.visible`. Note that this does imply that you will need to run convergence coverage checks that merge both Jest and Playwright in order to see your true code coverage.
- An alternative to the above, but **only** to be used where it makes the most sense for performance and/or testing burden, is using the hook [useMediaQuery](https://mui.com/material-ui/react-use-media-query/) in your code to include or exclude parts of a component in the render block. This is JS based and therefore will work as expected in Jest tests.
3. Enzyme snapshots have been regenerated to account for the new MUI5 components, and as such many tests also needed to be updated to match changes in the snapshot structure. A common difference encountered was references to a component such as `WithStyles(ForwardRef(Button))` had become `ForwardRef(Button)`, and will easy to fix is worth remembering. Check your snapshot structure if you find MUI4 Enzyme tests are failing.
4. In a great many cases it was no longer possible to run shallow Enzyme tests against components. This appears to be caused by MUI5 components using `Theme` _requiring_ a theme provider, and as such these tests were failing when a component in the tree tried to access a theme via useStyles. The [MUI5 testing page](https://mui.com/material-ui/guides/testing/) has been updated and no longer recommend testing snapshots _at all_ (see v4 version [here](https://v4.mui.com/guides/testing/)). We will continue to do so, however, so the solution moving forward is to use `Mount` to create a deep snapshot. In most cases existing Enzyme tests can be easily updated to produce a deep snapshot by updating the `setup` method to include a 3rd parameter of the `getElement` function:
`return getElement(PublicationCitation, props, {isShallow: false});` 
NB: this is just for illustration - a better approach is to include an `args` property in the `setup` function signature i.e. `function setup(testProps = {}, args = { isShallow: false })`. 
Note that your snapshot will need regenerating and tests modified to handle the new snapshot structure.
1. If an Enzyme test needs to refer to `wrapper.instance()`, and the component requires a `Theme` as mentioned above, and the instance is spying on a function, ensure the `wrapper` finds the component's name before calling instance. e.g. `wrapper.find(‘class name’).instance()`.
1. Enzyme tests that `simulate` a click or other user action, and have been updated to generate deep `Merge` snapshots, will likely need updating to find the actual button in the tree before firing the event (see https://github.com/wojtekmaj/enzyme-adapter-react-17/issues/45). For example, the click event for the element:
`
const playElement = wrapper.find('ForwardRef(IconButton)#playButton');
`
would need changing from:
`
playElement.simulate('click');
`
to:
`
playElement.find('button').simulate('click'); 
`
1. For Jest testing a component that uses `useTheme`, ensure you use the `rtlRender` renderer in your `setup` function. This will insert a `ThemeRenderer` in the tree and will allow your tests to pass. See `src/utils/test-utils.js` for the code behind this.
1. When testing dropdown boxes/lists (for example, with the `AutoCompleteAsynchronousField` component), your tests must ensure focus is in the target component before you attempt to change the contents of the input (`fireEvent.change()`), otherwise the expected popup window of options _will not appear_.
1. By default, the MUI5 `ToolTips` component no longer uses a title attribute to hold the wrapped component's tooltip text. Instead the `aria-label` attribute is used, and tests need to be updated to reflect this.
This behaviour can be changed by including the `describeChild`, however be aware of potential [accessibility issues](https://mui.com/material-ui/react-tooltip/#accessibility).
Note also that there are some elements that can not have `aria-label` as an attribute (see https://github.com/dequelabs/axe-core/issues/3205), and as such you may encounter Playwright Axe failures if you _do not_ use the `describeChild` attribute.
1. Playwright tests that look to enter text in to a multiline text field (i.e HMTL `TextArea`) may fail due to MUI5 inserting _two_ `TextArea` elements for each use of `<TextField multiline>`. Your tests should pick the first instance of the TextArea element for testing. No official information on this behaviour could be found at time of writing.
1. `MyEditorialAppointments` component adds a custom `DatePicker` bar with a 'Current year' button. In MUI4 clicking this button would automatically clause the calendar popup, however in MUI5 this is no longer the case.

### Tests that could not be fixed
Two tests have been c8 ignored in order to get the build passing. These are:

1. AdminContainer
1. MyIncompleteRecord

Despite many hours attempting to find a resolution to the Jest errors both produced no solution could be found, and so their tests have been ignored for now. A [ticket](https://www.pivotaltracker.com/story/show/184445375) has been created to revisit this situation at a later date.

## CKEditor

The Rich Editor is implemented with [CKEditor](https://ckeditor.com/docs/ckeditor5/latest/index.html). This is installed with npm modules.
Case Change is a premium feature (fees involved) since v41, but because we are using a free version of the Change Case plugin, we had to _build from source_

### Links

- CKEditor in React https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/react.html
- Creating the custom build (Classic): https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/quick-start-other.html

### Plugins

- Autoformat
- Bold
- General HTML Support
- Italic
- Link
- List
- Paste From Office
- Remove Format
- Special Characters (Arrows, Currency, Essentials, Latin, Mathematical, Text)
- Strikethrough
- Subscript
- Superscript
- Text transformation
- Underline
- Word count
- Letter Case Plugin
  - https://github.com/maziyank/ckeditor5-letter-case

If changes to ckeditor are required, these are sample commands:

```bash
 cd custom_modules/ckeditor5-custom-build/ # change into the modules subdirectory
 npm ci # install modules from package-lock file
 npm run build # after your changes, create the build files that our react app will pull in - MANDATORY!!
 # commit changes (including /build directory!!)
 cd ../../
```

We don't seem to need to issue any `ci` or `run build` commands for non-ckeditor localhost development, when not making changes to ckeditor - react picks up the build directory.

CKeditor says all the `@ckeditor/ckeditor5-` packages should have the same version (although there are a short number of exceptions).

