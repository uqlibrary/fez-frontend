import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Fragment, Slice } from '@tiptap/pm/model';

const flattenPastedContent = (slice, schema, preserveFormatting) => {
    if (preserveFormatting) {
        return slice;
    }

    const content = [];

    const addText = node => {
        if (node.isText) {
            content.push(schema.text(node.text));
            return;
        }

        node.forEach(addText);
    };

    slice.content.forEach((node, index) => {
        if (index > 0) {
            content.push(schema.text(' '));
        }

        addText(node);
    });

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
