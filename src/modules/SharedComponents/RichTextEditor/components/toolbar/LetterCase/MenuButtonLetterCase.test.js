import React from 'react';
import { fireEvent } from '@testing-library/react';
import { rtlRender } from 'test-utils';
import MenuButtonLetterCase from './MenuButtonLetterCase';

const mockSetUpperCase = jest.fn(() => ({
    run: jest.fn(),
}));

const mockEditor = {
    chain: jest.fn(() => ({
        focus: jest.fn(() => ({
            setUpperCase: mockSetUpperCase,
        })),
    })),
};

jest.mock('mui-tiptap', () => ({
    // eslint-disable-next-line react/prop-types
    MenuButton: ({ onClick, IconComponent }) => (
        <button data-testid="letter-case-button" onClick={onClick}>
            <IconComponent />
        </button>
    ),

    useRichTextEditorContext: jest.fn(() => mockEditor),
}));

const setup = () => rtlRender(<MenuButtonLetterCase />);

describe('MenuButtonLetterCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render letter case button', () => {
        const { getByTestId } = setup();

        expect(getByTestId('letter-case-button')).toBeInTheDocument();
    });

    it('should open menu when button is clicked', () => {
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('letter-case-button'));

        expect(getByText('Sentence case')).toBeInTheDocument();
        expect(getByText('lower case')).toBeInTheDocument();
        expect(getByText('UPPER CASE')).toBeInTheDocument();
        expect(getByText('Title Case')).toBeInTheDocument();
    });

    it('should execute uppercase command when selected', () => {
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('letter-case-button'));
        fireEvent.click(getByText('UPPER CASE'));

        expect(mockSetUpperCase).toHaveBeenCalled();
    });
});
