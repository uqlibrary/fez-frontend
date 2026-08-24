import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Fragment, Slice } from '@tiptap/pm/model';

const flattenPastedContent = (slice, schema, preservePasteFormatting) => {
    const content = [];

    slice.content.forEach(node => {
        node.forEach(child => {
            if (preservePasteFormatting) {
                content.push(child);
                return;
            }

            /* istanbul ignore else */
            if (child.isText) {
                content.push(schema.text(child.text));
            }
        });
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
