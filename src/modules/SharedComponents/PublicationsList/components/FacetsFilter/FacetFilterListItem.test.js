import React from 'react';
import { rtlRender as defaultRender, fireEvent } from 'test-utils';
import FacetFilterListItem from './FacetFilterListItem';

function setup(testProps = {}, render = defaultRender) {
    const props = {
        id: 'test',
        title: 'Test title',
        disabled: false,
        nestedItems: jest.fn(),
        ...testProps,
    };
    return render(<FacetFilterListItem {...props} />);
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

    it('should render as expanded when isActive props changes to true', () => {
        const { queryByTestId, rerender } = setup();

        expect(queryByTestId('expand-more-test')).toBeInTheDocument();
        expect(queryByTestId('expand-less-test')).not.toBeInTheDocument();

        setup({ isActive: true }, rerender);

        expect(queryByTestId('expand-more-test')).not.toBeInTheDocument();
        expect(queryByTestId('expand-less-test')).toBeInTheDocument();
    });

    it('should not collapsed when isActive props changes to false', () => {
        const { queryByTestId, rerender } = setup({ isActive: true });

        expect(queryByTestId('expand-more-test')).not.toBeInTheDocument();
        expect(queryByTestId('expand-less-test')).toBeInTheDocument();

        setup({ isActive: false }, rerender);

        expect(queryByTestId('expand-more-test')).not.toBeInTheDocument();
        expect(queryByTestId('expand-less-test')).toBeInTheDocument();
    });

    it('should toggle nested items on click', () => {
        const nestedItems = 'Testing';
        const { getByTestId, getByText } = setup({ nestedItems });
        expect(getByTestId('expand-more-test')).toBeInTheDocument();

        fireEvent.click(getByTestId('clickable-test'));
        expect(getByTestId('expand-less-test')).toBeInTheDocument();
        expect(getByText('Testing')).toBeInTheDocument();
    });

    it('should set correct aria-expanded value when items are clicked', () => {
        const nestedItems = 'Testing';
        const { getByTestId } = setup({ nestedItems });
        expect(getByTestId('clickable-test')).toBeInTheDocument();

        expect(getByTestId('clickable-test').getAttribute('aria-expanded')).toEqual('false');

        fireEvent.click(getByTestId('clickable-test'));
        expect(getByTestId('clickable-test').getAttribute('aria-expanded')).toEqual('true');

        fireEvent.click(getByTestId('clickable-test'));
        expect(getByTestId('clickable-test').getAttribute('aria-expanded')).toEqual('false');
    });
});
