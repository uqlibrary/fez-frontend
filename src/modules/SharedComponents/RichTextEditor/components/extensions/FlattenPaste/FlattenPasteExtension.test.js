import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import { Fragment, Slice } from '@tiptap/pm/model';

import FlattenPasteExtension from './FlattenPasteExtension';

describe('FlattenPasteExtension', () => {
    let editor;

    const createPlugin = (preserveFormatting = false) =>
        FlattenPasteExtension.config.addProseMirrorPlugins.call({
            editor,
            options: {
                preserveFormatting,
            },
        })[0];

    const createSlice = paragraphs => new Slice(Fragment.from(paragraphs), 0, 0);

    beforeEach(() => {
        editor = new Editor({
            extensions: [Document, Paragraph, Text, Bold, FlattenPasteExtension],
        });
    });

    afterEach(() => {
        editor.destroy();
    });

    describe('unit tests', () => {
        it('should remove line breaks without adding spaces', () => {
            const plugin = createPlugin();

            const paragraphs = ['Alert ID14804', 'Received29th January 2026 15:12', 'Requester IDuqdstew1'].map(text =>
                editor.schema.nodes.paragraph.create(null, editor.schema.text(text)),
            );

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.textContent).toBe(
                'Alert ID14804Received29th January 2026 15:12Requester IDuqdstew1',
            );
        });

        it('should preserve formatting when preserveFormatting is true', () => {
            const plugin = createPlugin(true);
            const bold = editor.schema.marks.bold.create();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Hello', [bold])),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('World')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            const paragraph = result.content.firstChild;

            expect(paragraph.textContent).toBe('HelloWorld');
            expect(paragraph.firstChild.marks).toEqual([bold]);
        });

        it('should remove formatting when preserveFormatting is false', () => {
            const plugin = createPlugin();
            const bold = editor.schema.marks.bold.create();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Hello', [bold])),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('World')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            const paragraph = result.content.firstChild;

            expect(paragraph.textContent).toBe('HelloWorld');
            expect(paragraph.firstChild.marks).toEqual([]);
        });
    });

    describe('integration test', () => {
        it('should flatten pasted content into a single paragraph', () => {
            const plugin = createPlugin();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Hello')),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('World')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.type.name).toBe('paragraph');
            expect(result.content.firstChild.textContent).toBe('HelloWorld');
        });
    });
});
