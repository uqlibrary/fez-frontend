# CKEditor 4

this is a pre-compiled version of CKEditor 4 with minimum required elements for eSpace.
Webpack loader is added to import CKEditor as a module (from <https://www.fomfus.com/articles/how-to-use-ckeditor-4-with-webpack>)

## Build details

This package is manually built on CKEditor website (CKEditor4 doesn't properly support proper JS modules/npm install)
Steps to build requied CKEditor:

- Navigate to <https://ckeditor.com/cke4/builder>
- 1.Select preset: Basic
- 2.Select plugins:
  - Add plugins:
    - Special Characters
    - Remove format
  - Remove plugins:
    - About CKEditor
    - Link
    - List
    - Indent List
  - Final list of plugins
    - Special characters
    - Remove format
    - Basic styles
    - Clipboard
    - Editor toolbar
    - Enter Key
    - Escape HTML Entitites
    - Floating space
    - IFrame editing area
    - Undo
    - Dialog
    - Dialog UI
    - Notification
    - UI Button
  - Skin: Moono-Lisa
- 3.Finalize and download: English only
- Download Optimized package
- Compare it to /custom_modules/ckeditor/ckeditor_build/* to make sure update is valid and no plugins are missing (build-config.js)
- Replace all contents of ckeditor_build with new package

## Known issues

When deployed to development environment (s3:dev/espace/master) CKEditor manually loads files (config.js/styles.js/etc) from root directory (s3:custom_modules/ckeditor). For a temporary fix custom_modules was uploaded to s3:dev directly.
It's not an issue in staging, production environment.
