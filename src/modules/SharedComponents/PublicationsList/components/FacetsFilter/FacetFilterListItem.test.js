import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import FacetFilterListItem from './FacetFilterListItem';

function setup(testProps = {}) {
    const props = {
        id: 'test',
        title: 'Test title',
        disabled: false,
        nestedItems: jest.fn(),
        ...testProps,
    };
    return rtlRender(<FacetFilterListItem {...props} />);
}

describe('Facet filter list item ', () => {
    it('should render empty component', () => {
        const { getByTestId, getByText } = setup();
        expect(getByTestId('clickable-test')).toBeInTheDocument();
        expect(getByTestId('expand-more-test')).toBeInTheDocument();
        expect(getByText('Test title')).toBeInTheDocument();
    });

    it('should render disabled component', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('clickable-test')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should toggle nested items on click', () => {
        const nestedItems = 'Testing';
        const { getByTestId, getByText } = setup({ nestedItems });
        expect(getByTestId('expand-more-test')).toBeInTheDocument();

        fireEvent.click(getByTestId('clickable-test'));
        expect(getByTestId('expand-less-test')).toBeInTheDocument();
        expect(getByText('Testing')).toBeInTheDocument();
    });
});
