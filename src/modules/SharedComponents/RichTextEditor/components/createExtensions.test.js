import { BulletList, OrderedList } from '@tiptap/extension-list';

import { createExtensions } from './createExtensions';

describe('createExtensions', () => {
    const getFlattenPasteExtension = extensions => extensions.find(extension => extension.name === 'flattenPaste');

    it('should include FlattenPasteExtension by default', () => {
        const extensions = createExtensions({});

        expect(getFlattenPasteExtension(extensions)).toBeDefined();
    });

    it('should preserve paste formatting when configured', () => {
        const extensions = createExtensions({
            preservePasteFormatting: true,
        });

        expect(getFlattenPasteExtension(extensions).options.preserveFormatting).toBe(true);
    });

    it('should not preserve paste formatting by default', () => {
        const extensions = createExtensions({});

        expect(getFlattenPasteExtension(extensions).options.preserveFormatting).toBe(false);
    });

    it('should exclude list extensions for single line editor', () => {
        const extensions = createExtensions({
            singleLine: true,
        });

        expect(extensions).not.toContain(BulletList);
        expect(extensions).not.toContain(OrderedList);
    });
});
