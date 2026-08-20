import React from 'react';
import { fireEvent } from '@testing-library/react';
import { rtlRender } from 'test-utils';

import MenuButtonSpecialCharacters from './MenuButtonSpecialCharacters';

const mockEditor = {
    editorView: { dom: { isConnected: true } },
    commands: { setContent: jest.fn() },
};

jest.mock('mui-tiptap', () => ({
    // eslint-disable-next-line react/prop-types
    MenuButton: ({ onClick, IconComponent }) => (
        <button data-testid="special-character-button" onClick={onClick}>
            <IconComponent />
        </button>
    ),

    useRichTextEditorContext: () => mockEditor,
}));

describe('MenuButtonSpecialCharacters', () => {
    beforeEach(() => {
        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            right: 100,
            bottom: 200,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render button', () => {
        const { getByTestId } = rtlRender(<MenuButtonSpecialCharacters onOpen={jest.fn()} />);

        expect(getByTestId('special-character-button')).toBeInTheDocument();
    });

    it('should open picker at button position', () => {
        const onOpen = jest.fn();

        const { getByTestId } = rtlRender(<MenuButtonSpecialCharacters onOpen={onOpen} />);

        fireEvent.click(getByTestId('special-character-button'));

        expect(onOpen).toHaveBeenCalledWith({ x: 104, y: 204 });
    });
});
