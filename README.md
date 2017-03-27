# eSpace frontend

[ ![Codeship Status for uqlibrary/espace-frontend](https://app.codeship.com/projects/5f018a50-f4f8-0134-5dd6-4eabb52e4bf9/status?branch=master)](https://app.codeship.com/projects/141087)
[![Dependency Status](https://david-dm.org/uqlibrary/espace-frontend.svg)](https://david-dm.org/uqlibrary/espace-frontend)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/espace-frontend/dev-status.svg)](https://david-dm.org/uqlibrary/espace-frontend)

eSpace frontend is a web interface application into UQ's digital repository 

- legacy eSpace application https://espace.library.uq.edu.au/
- current build https://development.library.uq.edu.au/espace/`branch_name`/


## Technology
- Code: `React (~0.15), Javascript (ES2015 - Babel), Immutable, SASS`
- State: `Redux, ReduxForm`
- Design: `Google Material Design - Material UI`
- Build and dev tools: `Webpack`
- Tests: `Jest/Nightwatch`

## Development
- `yarn`
- `yarn start`
- The website is now running on `http://localhost:3000/`
- For Hot Reloading to work in IntelliJ products, turn "safe write" off in the settings
- `yarn start:build` will run production build version on `http://dev-espace.library.uq.edu.au:9000/` (add `dev-espace.library.uq.edu.au` to your /etc/hosts)

Mock data is provided for all pages and actions under `src/mock/`.

## Testing

### Unit testing

Jest is used as testing tool for unit tests

TODO: test commands... 

### E2E testing
[Nightwatch.js](http://nightwatchjs.org/) is used to run end to end tests. 
 
- start dist version of the project by `yarn start:build`
- while dist version of the project is running, start tests by `yarn test:e2e`

codeship setup:

- `nohup bash -c "yarn start:build 2>&1 &" && sleep 20; cat nohup.out`
- `yarn test:e2e`


## Users
The RDMT allows the user to "login" as any test user. Simply add `?user=<username>` to the request and it will log you
in as that user. Usernames can be found in the `src/mock/data/staff.js` file.

## Deployment
eSpace deployment is 100% automated using Codeship, and is hosted in S3. All deployment data is stored within Codeship. 
Deployment pipelines are setup for branches: "master", "production" and any branch starting with "feature-". 

- TBA: Deployments to production are hosted on https://espace.library.uq.edu.au/ 
- All other branches are deployed on https://development.library.uq.edu/espace/`branchName`/.
