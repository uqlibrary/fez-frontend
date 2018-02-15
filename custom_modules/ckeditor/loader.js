/* loader.js */
var modulePath = 'custom_modules/ckeditor/ckeditor_build';
var publicPath = `espace/feature-wysiwyg/custom_modules/ckeditor/ckeditor_build`;

const path = process && process.env && process.env.CI_BRANCH ? `espace/${process.env.CI_BRANCH}/` : '';
window.CKEDITOR_BASEPATH = `${path}${modulePath}/`;

// Load your custom config.js file for CKEditor.
require(`!file-loader?context=${__dirname}&outputPath=/custom_modules/ckeditor/ckeditor_build/&publicPath=/espace/feature-wysiwyg/custom_modules/ckeditor/ckeditor_build/&name=[path][name].[ext]!./config.js`);

// Load your custom contents.css file in case you use iframe editor.
require(`!file-loader?context=${__dirname}&outputPath=/custom_modules/ckeditor/ckeditor_build/&publicPath=custom_modules/ckeditor/ckeditor_build/&name=[path][name].[ext]!./contents.css`);

// Load your custom styles.js file for CKEditor.
require(`!file-loader?context=${__dirname}&outputPath=/custom_modules/ckeditor/ckeditor_build/&publicPath=espace/feature-wysiwyg/custom_modules/ckeditor/ckeditor_build/&name=[path][name].[ext]!./styles.js`);

// Load files from plugins, excluding lang files.
// Limit to active plugins with
// Object.keys(CKEDITOR.plugins.registered).sort().toString().replace(/,/g, '|')
require.context(
    '!file-loader?name=[path][name].[ext]!ckeditor/ckeditor_build/plugins/',
    true,
    /^\.\/((dialog|specialchar)(\/(?!lang\/)[^/]+)*)?[^/]*$/
);

// Load lang files from plugins.
// Limit to active plugins with
// Object.keys(CKEDITOR.plugins.registered).sort().toString().replace(/,/g, '|')
require.context(
    '!file-loader?name=[path][name].[ext]!ckeditor/ckeditor_build/plugins/',
    true,
    /^\.\/(dialog|specialchar)\/(.*\/)*lang\/(en)\.js$/
);

// Load CKEditor lang files.
require.context(
    '!file-loader?name=[path][name].[ext]!ckeditor/ckeditor_build/lang',
    true,
    /(en)\.js/
);

// Load skin.
require.context(
    '!file-loader?name=[path][name].[ext]!ckeditor/ckeditor_build/skins/moono-lisa',
    true,
    /.*/
);
