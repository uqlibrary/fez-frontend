import React from 'react';

import { rtlRender } from 'test-utils';

import RichTextToolbar from './RichTextToolbar';

jest.mock('mui-tiptap', () => ({
    // eslint-disable-next-line react/prop-types
    MenuControlsContainer: ({ children }) => <div data-testid="menu-controls-container">{children}</div>,

    MenuDivider: () => <hr data-testid="menu-divider" />,

    MenuButtonBold: () => <button data-testid="bold-button">Bold</button>,

    MenuButtonItalic: () => <button data-testid="italic-button">Italic</button>,

    MenuButtonUnderline: () => <button data-testid="underline-button">Underline</button>,

    MenuButtonStrikethrough: () => <button data-testid="strikethrough-button">Strikethrough</button>,

    MenuButtonSubscript: () => <button data-testid="subscript-button">Subscript</button>,

    MenuButtonSuperscript: () => <button data-testid="superscript-button">Superscript</button>,

    MenuButtonEditLink: () => <button data-testid="edit-link-button">Edit Link</button>,

    MenuButtonBulletedList: () => <button data-testid="bulleted-list-button">Bulleted List</button>,

    MenuButtonOrderedList: () => <button data-testid="ordered-list-button">Ordered List</button>,

    MenuButtonRemoveFormatting: () => <button data-testid="remove-formatting-button">Remove Formatting</button>,

    MenuButtonUndo: () => <button data-testid="undo-button">Undo</button>,

    MenuButtonRedo: () => <button data-testid="redo-button">Redo</button>,
}));

jest.mock('./toolbar/LetterCase/MenuButtonLetterCase', () => () => (
    <button data-testid="letter-case-button">Letter Case</button>
));

const setup = (props = {}) => rtlRender(<RichTextToolbar {...props} />);

describe('RichTextToolbar', () => {
    it('should render common formatting controls', () => {
        const { getByTestId } = setup();

        expect(getByTestId('bold-button')).toBeInTheDocument();
        expect(getByTestId('italic-button')).toBeInTheDocument();
        expect(getByTestId('underline-button')).toBeInTheDocument();
        expect(getByTestId('strikethrough-button')).toBeInTheDocument();
        expect(getByTestId('subscript-button')).toBeInTheDocument();
        expect(getByTestId('superscript-button')).toBeInTheDocument();
    });

    it('should render full toolbar controls when singleLine is false', () => {
        const { getByTestId } = setup({
            singleLine: false,
        });

        expect(getByTestId('edit-link-button')).toBeInTheDocument();

        expect(getByTestId('ordered-list-button')).toBeInTheDocument();

        expect(getByTestId('bulleted-list-button')).toBeInTheDocument();
    });

    it('should hide extended controls when singleLine is true', () => {
        const { queryByTestId } = setup({
            singleLine: true,
        });

        expect(queryByTestId('edit-link-button')).not.toBeInTheDocument();

        expect(queryByTestId('ordered-list-button')).not.toBeInTheDocument();

        expect(queryByTestId('bulleted-list-button')).not.toBeInTheDocument();
    });

    it('should render letter case and formatting controls', () => {
        const { getByTestId } = setup();

        expect(getByTestId('letter-case-button')).toBeInTheDocument();

        expect(getByTestId('remove-formatting-button')).toBeInTheDocument();
    });

    it('should render undo and redo controls', () => {
        const { getByTestId } = setup();

        expect(getByTestId('undo-button')).toBeInTheDocument();

        expect(getByTestId('redo-button')).toBeInTheDocument();
    });

    it('should render menu dividers', () => {
        const { getAllByTestId } = setup();

        expect(getAllByTestId('menu-divider').length).toBe(3);
    });
});
