/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
// @ts-ignore
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import type { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editor';
import { Essentials } from '@ckeditor/ckeditor5-essentials/src/essentials';
import { Link } from '@ckeditor/ckeditor5-link/src/link';
import { List } from '@ckeditor/ckeditor5-list/src/list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { TextTransformation } from '@ckeditor/ckeditor5-typing/src/texttransformation';
import { Undo } from '@ckeditor/ckeditor5-undo/src/undo';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
declare class Editor extends ClassicEditor {
    static builtinPlugins: (typeof Bold | typeof Essentials | typeof Italic | typeof Link | typeof List | typeof Paragraph | typeof TextTransformation | typeof Undo | typeof RemoveFormat | typeof SpecialCharacters | typeof Strikethrough | typeof Subscript | typeof Superscript | typeof Underline)[];
    static defaultConfig: EditorConfig;
}
export default Editor;
