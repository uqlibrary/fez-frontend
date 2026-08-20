import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import PlainTextPasteExtension from './PlainTextPasteExtension';

describe('PlainTextPasteExtension', () => {
    let handlePaste;

    beforeEach(() => {
        const plugins = PlainTextPasteExtension.config.addProseMirrorPlugins.call({
            editor: {},
        });

        handlePaste = plugins[0].props.handlePaste;
    });

    describe('unit tests', () => {
        it('should return false when clipboard has no plain text', () => {
            const event = {
                clipboardData: {
                    getData: jest.fn(() => ''),
                },
            };

            expect(handlePaste({}, event)).toBe(false);
        });

        it('should paste plain text and dispatch transaction', () => {
            const dispatch = jest.fn();
            const replaceWith = jest.fn(() => 'transaction');

            const textNode = {
                nodeSize: 1,
            };

            const paragraphNode = {
                nodeSize: 1,
            };

            const view = {
                state: {
                    selection: {
                        from: 0,
                        to: 0,
                    },
                    schema: {
                        text: jest.fn(() => textNode),
                        nodes: {
                            paragraph: {
                                create: jest.fn(() => paragraphNode),
                            },
                        },
                    },
                    tr: {
                        replaceWith,
                    },
                },
                dispatch,
            };

            const event = {
                preventDefault: jest.fn(),
                clipboardData: {
                    getData: jest.fn(() => 'Hello World'),
                },
            };

            const result = handlePaste(view, event);

            expect(result).toBe(true);

            expect(event.preventDefault).toHaveBeenCalled();

            expect(view.state.schema.nodes.paragraph.create).toHaveBeenCalled();

            expect(replaceWith).toHaveBeenCalledWith(0, 0, expect.anything());

            expect(dispatch).toHaveBeenCalledWith('transaction');
        });

        it('should preserve blank lines', () => {
            const paragraphCreate = jest.fn(() => ({
                nodeSize: 1,
            }));

            const view = {
                state: {
                    selection: {
                        from: 0,
                        to: 0,
                    },
                    schema: {
                        text: jest.fn(() => ({
                            nodeSize: 1,
                        })),
                        nodes: {
                            paragraph: {
                                create: paragraphCreate,
                            },
                        },
                    },
                    tr: {
                        replaceWith: jest.fn(),
                    },
                },
                dispatch: jest.fn(),
            };

            const event = {
                preventDefault: jest.fn(),
                clipboardData: {
                    getData: jest.fn(() => 'Hello\n\nWorld'),
                },
            };

            handlePaste(view, event);

            expect(paragraphCreate).toHaveBeenCalledTimes(3);
        });

        it('should handle Windows line endings', () => {
            const paragraphCreate = jest.fn(() => ({
                nodeSize: 1,
            }));

            const view = {
                state: {
                    selection: {
                        from: 0,
                        to: 0,
                    },
                    schema: {
                        text: jest.fn(() => ({
                            nodeSize: 1,
                        })),
                        nodes: {
                            paragraph: {
                                create: paragraphCreate,
                            },
                        },
                    },
                    tr: {
                        replaceWith: jest.fn(),
                    },
                },
                dispatch: jest.fn(),
            };

            const event = {
                preventDefault: jest.fn(),
                clipboardData: {
                    getData: jest.fn(() => 'Hello\r\nWorld'),
                },
            };

            handlePaste(view, event);

            expect(paragraphCreate).toHaveBeenCalledTimes(2);
        });
    });

    describe('integration test', () => {
        let editor;

        beforeEach(() => {
            editor = new Editor({
                extensions: [Document, Paragraph, Text, PlainTextPasteExtension],
                content: '<p>Start</p>',
            });
        });

        afterEach(() => {
            editor.destroy();
        });

        it('should insert plain text into the editor', () => {
            editor.commands.focus('end');

            const plugin = PlainTextPasteExtension.config.addProseMirrorPlugins.call({
                editor,
            })[0];

            const event = {
                preventDefault: jest.fn(),
                clipboardData: {
                    getData: jest.fn(() => 'Hello\nWorld'),
                },
            };

            const result = plugin.props.handlePaste(editor.view, event);

            expect(result).toBe(true);

            expect(event.preventDefault).toHaveBeenCalled();

            expect(editor.getHTML()).toBe('<p>Start</p><p>Hello</p><p>World</p>');
        });
    });
});
