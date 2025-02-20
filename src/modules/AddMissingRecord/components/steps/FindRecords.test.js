import React from 'react';
import FindRecords from './FindRecords';
import { render, WithRouter, WithReduxStore, fireEvent, getReduxStoreState } from 'test-utils';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(props = {}) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <FindRecords {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Search record', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render stepper and a publication search form', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should perform search and navigate to results page', () => {
        const initialState = getReduxStoreState('searchRecordsReducer');
        const { getByRole } = setup();

        fireEvent.change(getByRole('textbox', { name: 'Enter DOI, Pubmed Id or Title' }), {
            target: { value: 'publication title' },
        });

        fireEvent.click(getByRole('button', { name: 'Search' }));

        expect(initialState).not.toEqual(getReduxStoreState('searchRecordsReducer'));
        expect(mockUseNavigate).toHaveBeenCalled();
    });

    it('should handle skip search', () => {
        const { container, getByRole } = setup();
        expect(container).toMatchSnapshot();
        fireEvent.click(getByRole('button', { name: 'Skip search' }));
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/add/new');
    });
});
