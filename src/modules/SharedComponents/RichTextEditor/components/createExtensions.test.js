import { createExtensions } from './createExtensions';
import { PlainTextPaste } from './extensions';
import { BulletList, OrderedList } from '@tiptap/extension-list';

describe('createExtensions', () => {
    it('should enable plain text paste by default', () => {
        const extensions = createExtensions({});

        expect(extensions).toContain(PlainTextPaste);
    });

    it('should include PlainTextPaste when textOnlyOnPaste is true', () => {
        const extensions = createExtensions({
            singleLine: false,
            textOnlyOnPaste: true,
        });

        expect(extensions).toContain(PlainTextPaste);
    });

    it('should not include PlainTextPaste when textOnlyOnPaste is false', () => {
        const extensions = createExtensions({
            singleLine: false,
            textOnlyOnPaste: false,
        });

        expect(extensions).not.toContain(PlainTextPaste);
    });

    it('should exclude list extensions for single line editor', () => {
        const extensions = createExtensions({
            singleLine: true,
        });

        expect(extensions).not.toContain(BulletList);
        expect(extensions).not.toContain(OrderedList);
    });
});
