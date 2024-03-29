import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import OpenAccessFilter from './OpenAccessFilter';

function setup(testProps = {}) {
    const props = {
        onChange: jest.fn(),
        disabled: false,
        isActive: false,
        locale: { displayTitle: 'Open access status', activeFilter: 'Show open access only' },
        ...testProps,
    };
    return rtlRender(<OpenAccessFilter {...props} />);
}

describe('OpenAccessFilter ', () => {
    it('should render empty component', () => {
        const { getByText, getByTestId } = setup({});
        expect(getByText('Open access status')).toBeInTheDocument();
        expect(getByTestId('expand-more-facet-category-open-access')).toBeInTheDocument();
    });

    it('should render expanded facet when clicked', () => {
        const { getByText, getByTestId } = setup({});
        expect(getByText('Open access status')).toBeInTheDocument();
        expect(getByTestId('expand-more-facet-category-open-access')).toBeInTheDocument();
        fireEvent.click(getByTestId('expand-more-facet-category-open-access'));

        expect(getByText('Show open access only')).toBeInTheDocument();
    });

    it('should render selected facet already open if active', () => {
        const { getByText, getByTestId } = setup({ isActive: true });

        expect(getByText('Show open access only')).toBeInTheDocument();
        expect(getByTestId('clear-facet-filter-nested-item-open-access')).toBeInTheDocument();
    });

    it('should call onChange if value has changed', () => {
        const onChange = jest.fn();
        const { getByText, getByTestId } = setup({ isActive: true, onChange });

        expect(getByText('Show open access only')).toBeInTheDocument();
        expect(getByTestId('clear-facet-filter-nested-item-open-access')).toBeInTheDocument();
        fireEvent.click(getByText('Show open access only'));
        expect(onChange).toBeCalledWith(false);
    });
});
