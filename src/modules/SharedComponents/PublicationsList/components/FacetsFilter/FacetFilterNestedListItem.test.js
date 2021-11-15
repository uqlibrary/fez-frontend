import React from 'react';
import { rtlRender } from 'test-utils';
import FacetFilterNestedListItem from './FacetFilterNestedListItem';

function setup(testProps = {}) {
    const props = {
        index: 0,
        primaryText: 'Test facet filter',
        disabled: false,
        isActive: false,
        onFacetClick: jest.fn(),
        ...testProps,
    };
    return rtlRender(<FacetFilterNestedListItem {...props} />);
}

describe('Facet filter nested list item ', () => {
    it('should render default filter view', () => {
        const { getByText } = setup({ primaryText: 'Test filter' });
        expect(getByText('Test filter')).toBeInTheDocument();
    });

    it('should render active filter view', () => {
        const { getByText, getByTestId } = setup({ primaryText: 'Test filter', isActive: true });
        expect(getByText('Test filter')).toBeInTheDocument();
        expect(getByTestId('clear-facet-filter-nested-item-0')).toBeInTheDocument();
    });
});
