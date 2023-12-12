/**
 * based on https://github.com/jainsuneet/ckeditor5-build-classic-extended/blob/master/src/ckeditor.js
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';

import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Capitalise from './components/Capitalise';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
    Bold,
    Italic,
    Link,
    RemoveFormat,
    SpecialCharacters,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
];

ClassicEditor.plugins = [Capitalise];

// Editor configuration.
ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            // ...(!!fieldProps.singleLine ? [] : ['|', 'link', 'numberedList', 'bulletedList']),
            '|',
            'removeFormat',
            'specialCharacters',
            'Capitalise',
            '|',
            'undo',
            'redo',
        ],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'en',
};
