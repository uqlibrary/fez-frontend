import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Fragment, Slice } from '@tiptap/pm/model';

const flattenPastedContent = (slice, schema, preservePasteFormatting) => {
    const content = [];

    const addContent = node => {
        if (node.isText) {
            content.push(preservePasteFormatting ? node : schema.text(node.text));
            return;
        }

        node.forEach(addContent);
    };

    slice.content.forEach(addContent);

    const paragraph = schema.nodes.paragraph.create(null, Fragment.from(content));

    return new Slice(Fragment.from(paragraph), 0, 0);
};

const FlattenPasteExtension = Extension.create({
    name: 'flattenPaste',

    addOptions() {
        return {
            preserveFormatting: false,
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    transformPasted: slice =>
                        flattenPastedContent(slice, this.editor.schema, this.options.preserveFormatting),
                },
            }),
        ];
    },
});

export default FlattenPasteExtension;
