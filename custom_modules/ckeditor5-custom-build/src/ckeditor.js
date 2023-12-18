/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
// import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Undo } from '@ckeditor/ckeditor5-undo';

import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import LetterCase from "./LetterCase";

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

export default class Editor extends ClassicEditorBase {}

Editor.builtinPlugins = [
		Bold,
		Italic,
		Link,
		List,
		Paragraph,
		Undo,
		RemoveFormat,
		SpecialCharacters,
		Strikethrough,
		Subscript,
		Superscript,
		Underline,
		LetterCase,
	];

Editor.defaultConfig = {
	toolbar: {
		items: [
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'underline',
			'strikethrough',
			'subscript',
			'superscript',
			'|',
			'removeFormat',
			'specialCharacters',
			'|',
			'undo',
			'redo',
			'LetterCase',
		]
	},
	language: 'en'
	};
