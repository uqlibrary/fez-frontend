CKEditor 5 letter Case Plugin
========================================

Based from https://github.com/maziyank/ckeditor5-letter-case/ which has not updated since 2020.

Updated ckeditor versions which must match!

This simple plugin allow you to change between lower case and upper case letters, capitalize, or to mix case the text selection in the ckeditor 5.

## Issues
Feel free to submit issues and enhancement requests.

## Usage

In your ckeditor5 project:

```
npm i ckeditor5-letter-case
```
or
```
yarn add ckeditor5-letter-case
```

Update src/ckeditor.js with:

```js
import LetterCase from 'ckeditor5-letter-case';

Editor.builtinPlugins = [
  // ...
  LetterCase,
  // ...
];

Editor.defaultConfig = {
  toolbar: {
    items: [
      // ...
      'LetterCase',
      // ...
    ]
  },
};
```

Then

```
npm run build
```
or
```
yarn build
```

## License
Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). 
