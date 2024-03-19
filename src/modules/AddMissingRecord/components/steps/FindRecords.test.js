import React from 'react';
import FindRecords from './FindRecords';
import { render, WithRouter, WithReduxStore, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        navigate: testProps.navigate || jest.fn(),
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <FindRecords {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Search record', () => {
    it('should render stepper and a publication search form', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should perform search and navigate to results page', () => {
        const searchPublications = jest.fn();
        const navigateToResults = jest.fn();

        const { getByRole } = setup({
            navigate: navigateToResults,
            actions: { searchPublications: searchPublications },
        });

        fireEvent.change(getByRole('textbox', { name: 'Enter DOI, Pubmed Id or Title' }), {
            target: { value: 'publication title' },
        });

        fireEvent.click(getByRole('button', { name: 'Search' }));

        expect(searchPublications).toBeCalled();
        expect(navigateToResults).toBeCalled();
    });

    it('should handle skip search', () => {
        const navigateFn = jest.fn();
        const { container, getByRole } = setup({
            navigate: navigateFn,
        });
        expect(container).toMatchSnapshot();
        fireEvent.click(getByRole('button', { name: 'Skip search' }));
        expect(navigateFn).toHaveBeenCalledWith('/records/add/new');
    });
});
