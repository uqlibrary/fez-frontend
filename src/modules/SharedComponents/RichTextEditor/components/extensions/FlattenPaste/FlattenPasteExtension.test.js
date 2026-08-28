import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import { ListItem, BulletList } from '@tiptap/extension-list';
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
            extensions: [Document, Paragraph, Text, Bold, ListItem, BulletList, FlattenPasteExtension],
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
                'Alert ID14804 Received29th January 2026 15:12 Requester IDuqdstew1',
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

            expect(paragraph.textContent).toBe('Hello World');
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

            expect(paragraph.textContent).toBe('Hello World');
            expect(paragraph.firstChild.marks).toEqual([]);
        });

        it('should flatten pasted content into a single paragraph', () => {
            const plugin = createPlugin();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Hello')),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('World')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.type.name).toBe('paragraph');
            expect(result.content.firstChild.textContent).toBe('Hello World');
        });

        it('should flatten direct text nodes', () => {
            const plugin = createPlugin();

            const textNodes = [editor.schema.text('Hello '), editor.schema.text('World'), editor.schema.text('!')];

            const result = plugin.props.transformPasted(new Slice(Fragment.from(textNodes), 0, 0));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.type.name).toBe('paragraph');
            expect(result.content.firstChild.textContent).toBe('Hello World!');
        });

        it('should flatten paragraphs containing multiple text nodes', () => {
            const plugin = createPlugin();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(
                    null,
                    Fragment.from([editor.schema.text('Hello '), editor.schema.text('World')]),
                ),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Goodbye')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.textContent).toBe('Hello World Goodbye');
        });

        it('should flatten nested block structures', () => {
            const plugin = createPlugin();

            const list = editor.schema.nodes.bulletList.create(null, [
                editor.schema.nodes.listItem.create(
                    null,
                    editor.schema.nodes.paragraph.create(null, editor.schema.text('First')),
                ),
                editor.schema.nodes.listItem.create(
                    null,
                    editor.schema.nodes.paragraph.create(null, editor.schema.text('Second')),
                ),
            ]);

            const result = plugin.props.transformPasted(createSlice([list]));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.textContent).toBe('FirstSecond');
        });

        it('should preserve formatting from nested structures', () => {
            const plugin = createPlugin(true);
            const bold = editor.schema.marks.bold.create();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(
                    null,
                    Fragment.from([editor.schema.text('Hello '), editor.schema.text('World', [bold])]),
                ),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('!')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            const paragraph = result.content.firstChild;

            expect(paragraph.textContent).toBe('Hello World !');
            expect(paragraph.childCount).toBe(3);

            expect(paragraph.child(0).marks).toEqual([]);
            expect(paragraph.child(1).marks).toEqual([bold]);
            expect(paragraph.child(2).marks).toEqual([]);
        });

        it('should remove formatting from direct text nodes', () => {
            const plugin = createPlugin();
            const bold = editor.schema.marks.bold.create();

            const textNodes = [editor.schema.text('Hello '), editor.schema.text('World', [bold])];

            const result = plugin.props.transformPasted(new Slice(Fragment.from(textNodes), 0, 0));

            const paragraph = result.content.firstChild;

            expect(paragraph.textContent).toBe('Hello  World');
            expect(paragraph.firstChild.marks).toEqual([]);
        });

        it('should flatten mixed text and paragraph structures', () => {
            const plugin = createPlugin();

            const content = [
                editor.schema.text('Hello '),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('World')),
                editor.schema.text('!'),
            ];

            const result = plugin.props.transformPasted(createSlice(content));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.textContent).toBe('Hello  World !');
        });
    });
});
