import React from 'react';
import { render, WithRouter, fireEvent } from 'test-utils';
import BackToSearchButton from './BackToSearchButton';

const mockUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
}));

const setup = ({ state = {}, initialEntries = ['/'] } = {}) => {
    return render(
        <WithRouter initialEntries={initialEntries}>
            <BackToSearchButton {...state} />
        </WithRouter>,
    );
};

describe('Back To Search button', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('should render', () => {
        const { queryByTestId } = setup({});
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });

    it('should return back to search page when clicked', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
        fireEvent.click(queryByTestId('return-to-search-results-button'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/journals/search/');
    });

    it('should return back to previous location if supplied', () => {
        const prevLocation = { pathname: 'test', search: '?query=abc', isActive: true };
        const { queryByTestId } = setup({
            state: {
                prevLocation: prevLocation,
            },
        });
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
        fireEvent.click(queryByTestId('return-to-search-results-button'));
        expect(mockUseNavigate).toHaveBeenCalledWith(prevLocation, { replace: true });
    });
});
