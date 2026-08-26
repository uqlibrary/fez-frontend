import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import { ListItem, BulletList, OrderedList } from '@tiptap/extension-list';
import History from '@tiptap/extension-history';
import HardBreak from '@tiptap/extension-hard-break';
import { LinkBubbleMenuHandler } from 'mui-tiptap';

import { LetterCase, FlattenPasteExtension } from './extensions';

// Prevent newly typed text at the start or end of a link from
// automatically becoming part of the hyperlink.
const CustomLinkExtension = Link.extend({
    inclusive: false,
});

export const createExtensions = ({ singleLine = false, preservePasteFormatting = false }) => [
    Document,
    Paragraph,
    Text,

    Bold,
    Italic,
    Underline,
    Strike,
    Superscript,
    Subscript,
    LetterCase,

    CustomLinkExtension.configure({
        openOnClick: false,
    }),

    ...(!singleLine ? [ListItem, BulletList, OrderedList, HardBreak] : []),

    History,

    FlattenPasteExtension.configure({ preserveFormatting: preservePasteFormatting }),

    LinkBubbleMenuHandler,
];
