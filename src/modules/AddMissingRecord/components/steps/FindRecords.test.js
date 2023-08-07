import React from 'react';
import FindRecords from './FindRecords';
import { render, WithReduxStore, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        history: {},
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <FindRecords {...props} />
        </WithReduxStore>,
    );
}

describe('Search record', () => {
    it('should render stepper and a publication search form', () => {
        const { container } = setup({ history: {} });
        expect(container).toMatchSnapshot();
    });

    it('should perform search and navigate to results page', () => {
        const searchPublications = jest.fn();
        const navigateToResults = jest.fn();

        const { getByRole } = setup({
            history: { push: navigateToResults },
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
        const pushFn = jest.fn();
        const { container, getByRole } = setup({
            history: {
                push: pushFn,
            },
        });
        expect(container).toMatchSnapshot();
        fireEvent.click(getByRole('button', { name: 'Skip search' }));
        expect(pushFn).toHaveBeenCalledWith('/records/add/new');
    });
});
