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

    const createSlice = (content, openStart = 0, openEnd = 0) => new Slice(Fragment.from(content), openStart, openEnd);

    beforeEach(() => {
        editor = new Editor({
            extensions: [Document, Paragraph, Text, Bold, ListItem, BulletList, FlattenPasteExtension],
        });
    });

    afterEach(() => {
        editor.destroy();
    });

    describe('preserveFormatting: false', () => {
        it('should flatten paragraphs into a single paragraph and add spaces between them', () => {
            const plugin = createPlugin();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Alert ID14804')),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Received 29th January 2026 15:12')),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Requester IDuqdstew1')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            expect(result.content.childCount).toBe(1);
            expect(result.content.firstChild.type.name).toBe('paragraph');
            expect(result.content.firstChild.textContent).toBe(
                'Alert ID14804 Received 29th January 2026 15:12 Requester IDuqdstew1',
            );
        });

        it('should remove formatting from paragraphs', () => {
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

            const result = plugin.props.transformPasted(createSlice(textNodes));

            const paragraph = result.content.firstChild;

            expect(result.content.childCount).toBe(1);
            expect(paragraph.type.name).toBe('paragraph');
            expect(paragraph.textContent).toBe('Hello World!');
            expect(paragraph.firstChild.marks).toEqual([]);
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

        it('should flatten nested list structures into a single paragraph', () => {
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
            expect(result.content.firstChild.type.name).toBe('paragraph');
            expect(result.content.firstChild.textContent).toBe('FirstSecond');
        });

        it('should remove formatting from direct text nodes', () => {
            const plugin = createPlugin();
            const bold = editor.schema.marks.bold.create();

            const textNodes = [editor.schema.text('Hello'), editor.schema.text('World', [bold])];

            const result = plugin.props.transformPasted(createSlice(textNodes));

            const paragraph = result.content.firstChild;

            expect(paragraph.textContent).toBe('Hello World');
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
            expect(result.content.firstChild.type.name).toBe('paragraph');
            expect(result.content.firstChild.textContent).toBe('Hello  World !');
        });
    });

    describe('preserveFormatting: true', () => {
        it('should preserve paragraph boundaries and inline formatting', () => {
            const plugin = createPlugin(true);
            const bold = editor.schema.marks.bold.create();

            const paragraphs = [
                editor.schema.nodes.paragraph.create(null, editor.schema.text('Hello', [bold])),
                editor.schema.nodes.paragraph.create(null, editor.schema.text('World')),
            ];

            const result = plugin.props.transformPasted(createSlice(paragraphs));

            expect(result.content.childCount).toBe(2);

            expect(result.content.child(0).type.name).toBe('paragraph');
            expect(result.content.child(0).textContent).toBe('Hello');
            expect(result.content.child(0).firstChild.marks).toEqual([bold]);

            expect(result.content.child(1).type.name).toBe('paragraph');
            expect(result.content.child(1).textContent).toBe('World');
        });

        it('should preserve formatting within a paragraph', () => {
            const plugin = createPlugin(true);
            const bold = editor.schema.marks.bold.create();

            const paragraph = editor.schema.nodes.paragraph.create(
                null,
                Fragment.from([editor.schema.text('Hello'), editor.schema.text('World', [bold])]),
            );

            const result = plugin.props.transformPasted(createSlice([paragraph]));

            const resultParagraph = result.content.firstChild;

            expect(resultParagraph.textContent).toBe('HelloWorld');
            expect(resultParagraph.childCount).toBe(2);

            expect(resultParagraph.child(0).marks).toEqual([]);
            expect(resultParagraph.child(1).marks).toEqual([bold]);
        });

        it('should preserve nested list structures and inline formatting', () => {
            const plugin = createPlugin(true);
            const bold = editor.schema.marks.bold.create();

            const list = editor.schema.nodes.bulletList.create(null, [
                editor.schema.nodes.listItem.create(
                    null,
                    editor.schema.nodes.paragraph.create(null, editor.schema.text('First', [bold])),
                ),
                editor.schema.nodes.listItem.create(
                    null,
                    editor.schema.nodes.paragraph.create(null, editor.schema.text('Second')),
                ),
            ]);

            const result = plugin.props.transformPasted(createSlice([list], 1, 1));

            expect(result.content.childCount).toBe(1);

            const resultList = result.content.firstChild;

            expect(resultList.type.name).toBe('bulletList');
            expect(resultList.childCount).toBe(2);

            expect(resultList.child(0).type.name).toBe('listItem');
            expect(resultList.child(0).firstChild.type.name).toBe('paragraph');
            expect(resultList.child(0).firstChild.textContent).toBe('First');
            expect(resultList.child(0).firstChild.firstChild.marks).toEqual([bold]);

            expect(resultList.child(1).type.name).toBe('listItem');
            expect(resultList.child(1).firstChild.type.name).toBe('paragraph');
            expect(resultList.child(1).firstChild.textContent).toBe('Second');
        });
    });
});
