import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import LetterCaseExtension from './LetterCaseExtension';

describe('LetterCaseExtension', () => {
    let editor;

    beforeEach(() => {
        editor = new Editor({
            extensions: [Document, Paragraph, Text, LetterCaseExtension],
            content: '<p>Hello World</p>',
        });
    });

    afterEach(() => {
        editor?.destroy();
    });

    it('should register letter case commands', () => {
        expect(editor.commands.setUpperCase).toBeDefined();
        expect(editor.commands.setLowerCase).toBeDefined();
        expect(editor.commands.setTitleCase).toBeDefined();
        expect(editor.commands.setSentenceCase).toBeDefined();
    });

    it('should convert selected text to upper case', () => {
        editor.commands.setTextSelection({
            from: 1,
            to: 6,
        });

        editor.commands.setUpperCase();

        expect(editor.getHTML()).toBe('<p>HELLO World</p>');
    });

    it('should convert selected text to lower case', () => {
        editor.commands.setTextSelection({
            from: 1,
            to: 6,
        });

        editor.commands.setLowerCase();

        expect(editor.getHTML()).toBe('<p>hello World</p>');
    });

    it('should convert selected text to title case', () => {
        editor.commands.setTextSelection({
            from: 1,
            to: 12,
        });

        editor.commands.setTitleCase();

        expect(editor.getHTML()).toBe('<p>Hello World</p>');
    });

    it('should convert selected text to sentence case', () => {
        editor.commands.setContent('<p>HELLO WORLD</p>');

        editor.commands.setTextSelection({
            from: 1,
            to: 12,
        });

        editor.commands.setSentenceCase();

        expect(editor.getHTML()).toBe('<p>Hello world</p>');
    });

    it('should not change text when no text is selected', () => {
        editor.commands.setTextSelection({
            from: 1,
            to: 1,
        });

        expect(editor.commands.setUpperCase()).toBe(false);

        expect(editor.getHTML()).toBe('<p>Hello World</p>');
    });
});
