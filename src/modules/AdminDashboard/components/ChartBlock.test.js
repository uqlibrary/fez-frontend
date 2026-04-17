import React from 'react';
import { render } from 'test-utils';
import ChartBlock from './ChartBlock';

const setup = (props = {}, renderer = render) => {
    return renderer(<ChartBlock id="test" render={() => {}} {...props} />);
};

describe('ChartBlock', () => {
    const children = <div data-testid="test-child">Test child</div>;
    it('should render loading skeleton', () => {
        const { getByTestId } = setup({
            loading: true,
        });

        expect(getByTestId('test-chart-skeleton')).toBeInTheDocument();
    });

    it('should render children', () => {
        const { container, getByTestId } = setup({
            loading: false,
            success: true,
            render: () => children,
        });

        expect(container).not.toBeEmptyDOMElement();
        expect(getByTestId('test-child')).toBeInTheDocument();
    });

    it('should return null when not success', () => {
        const { container } = setup({ loading: false, success: false, render: () => children });
        expect(container).toBeEmptyDOMElement();
    });

    it('should return null when has no data', () => {
        const { container } = setup({ loading: false, success: true, hasData: false, render: () => children });
        expect(container).toBeEmptyDOMElement();
    });
});
