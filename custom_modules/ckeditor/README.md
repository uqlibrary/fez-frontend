# CKEditor 4

this is a pre-compiled version of CKEditor 4 with minimum required elements for eSpace.
Webpack loader is added to import CKEditor as a module (from https://www.fomfus.com/articles/how-to-use-ckeditor-4-with-webpack)

## Known issues
When deployed to development environment (s3:dev/espace/master) CKEditor manually loads files (config.js/styles.js/etc) from root directory (s3:custom_modules/ckeditor). For a temporary fix custom_modules was uploaded to s3:dev directly.
It's not an issue in staging, production environment.