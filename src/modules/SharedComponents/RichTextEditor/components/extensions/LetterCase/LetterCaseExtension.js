import { Extension } from '@tiptap/core';

import { lowerCase, upperCase, titleCase, sentenceCase } from './utils';

const replaceSelectedText = transform => {
    return ({ state, dispatch }) => {
        const { from, to } = state.selection;

        if (from === to) {
            return false;
        }

        const text = state.doc.textBetween(from, to, ' ');

        const transformedText = transform(text);

        /* istanbul ignore else */
        if (dispatch) {
            dispatch(state.tr.insertText(transformedText, from, to));
        }

        return true;
    };
};

const LetterCase = Extension.create({
    name: 'letterCase',

    addCommands() {
        return {
            setUpperCase: () => replaceSelectedText(upperCase),

            setLowerCase: () => replaceSelectedText(lowerCase),

            setTitleCase: () => replaceSelectedText(titleCase),

            setSentenceCase: () => replaceSelectedText(sentenceCase),
        };
    },
});

export default LetterCase;
