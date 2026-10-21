import React from 'react';
import { fireEvent } from '@testing-library/react';

import { rtlRender } from 'test-utils';

import SpecialCharactersPicker from './SpecialCharactersPicker';

const mockRun = jest.fn();

const mockInsertContent = jest.fn(() => ({
    run: mockRun,
}));

const mockEditor = {
    isDestroyed: false,
    isInitialized: true,
    chain: jest.fn(() => ({
        focus: jest.fn(() => ({
            insertContent: mockInsertContent,
        })),
    })),
};

jest.mock('mui-tiptap', () => ({
    useRichTextEditorContext: jest.fn(() => mockEditor),
}));

const setup = (props = {}) =>
    rtlRender(<SpecialCharactersPicker open position={{ x: 10, y: 20 }} onClose={jest.fn()} {...props} />);

describe('SpecialCharactersPicker', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockEditor.isDestroyed = false;
        mockEditor.isInitialized = true;
    });

    it('should not render when closed', () => {
        const { queryByText } = setup({ open: false });

        expect(queryByText('Special characters')).not.toBeInTheDocument();
    });

    it('should render picker', () => {
        const { getByText } = setup();

        expect(getByText('Special characters')).toBeInTheDocument();
    });

    it('should render default category characters', () => {
        const { getByText } = setup();

        expect(getByText('←')).toBeInTheDocument();
        expect(getByText('→')).toBeInTheDocument();
    });

    it('should display character details when hovering a character', () => {
        const { getByText } = setup();

        fireEvent.mouseEnter(getByText('←'));

        expect(getByText('Leftwards simple arrow')).toBeInTheDocument();
        expect(getByText('U+2190')).toBeInTheDocument();
    });

    it('should insert character when selected', () => {
        const { getByText } = setup();

        fireEvent.click(getByText('←'));

        expect(mockEditor.chain).toHaveBeenCalled();
        expect(mockInsertContent).toHaveBeenCalledWith('←');
        expect(mockRun).toHaveBeenCalled();
    });

    it('should close picker when close button is clicked', () => {
        const onClose = jest.fn();

        const { getByTestId } = setup({ onClose });

        fireEvent.click(getByTestId('special-character-close-button'));

        expect(onClose).toHaveBeenCalled();
    });

    it('should change category', () => {
        const { getByRole, getByText, queryByText } = setup();

        fireEvent.mouseDown(getByRole('combobox'));

        fireEvent.click(getByRole('option', { name: 'Arrows' }));

        expect(getByText('←')).toBeInTheDocument();
        expect(queryByText('€')).not.toBeInTheDocument();
    });

    it('should update panel position when position changes', () => {
        const { container, rerender } = setup();

        rerender(<SpecialCharactersPicker open position={{ x: 100, y: 200 }} onClose={jest.fn()} />);

        expect(container.firstChild).toHaveStyle({ left: '100px', top: '200px' });
    });

    it('should start dragging only with left mouse button', () => {
        const { getByText, container } = setup();

        const header = getByText('Special characters');

        fireEvent.mouseDown(header, { button: 2, clientX: 50, clientY: 50 });

        fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });

        expect(container.firstChild).toHaveStyle({ left: '10px', top: '20px' });
    });

    it('should drag panel when left mouse button is pressed', () => {
        const { getByText, container } = setup();

        const header = getByText('Special characters');

        fireEvent.mouseDown(header, { button: 0, clientX: 50, clientY: 50 });

        fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });

        expect(container.firstChild).toHaveStyle({ left: '60px', top: '70px' });

        fireEvent.mouseUp(window);
    });
});
