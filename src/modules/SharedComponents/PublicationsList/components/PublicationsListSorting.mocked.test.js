import React from 'react';
import PublicationsListSorting from './PublicationsListSorting';
import { rtlRender } from 'test-utils';

jest.mock('locale', () => ({
    locale: {
        components: {
            sorting: {
                sortBy: [
                    {
                        value: false,
                    },
                ],
                sortDirection: [false],
            },
        },
    },
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<PublicationsListSorting {...props} />);
}

describe('PublicationsListSorting', () => {
    it('should create component with missing locale', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
