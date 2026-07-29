import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Fragment } from '@tiptap/pm/model';

const PlainTextPasteExtension = Extension.create({
    name: 'plainTextPaste',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste(view, event) {
                        const text = event.clipboardData?.getData('text/plain');

                        if (!text) {
                            return false;
                        }

                        event.preventDefault();

                        const { state, dispatch } = view;

                        const paragraphs = text
                            .replace(/\r\n/g, '\n')
                            .split('\n')
                            .map(line =>
                                state.schema.nodes.paragraph.create(null, line ? state.schema.text(line) : null),
                            );

                        dispatch(
                            state.tr.replaceWith(state.selection.from, state.selection.to, Fragment.from(paragraphs)),
                        );

                        return true;
                    },
                },
            }),
        ];
    },
});

export default PlainTextPasteExtension;
