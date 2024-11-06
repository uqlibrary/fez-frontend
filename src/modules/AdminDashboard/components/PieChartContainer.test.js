import React from 'react';

import { render } from 'test-utils';

import PieChartContainer from './PieChartContainer';

const setup = (props = {}, renderer = render) => {
    return renderer(<PieChartContainer id="test" {...props} />);
};

describe('PieChartContainer', () => {
    const label = 'Test label';
    const subtext = 'Test subtext';
    const children = <div data-testid="test-child">Test child</div>;

    it('should render title and child only', () => {
        const { getByText, getByTestId, queryByText } = setup({
            label,
            children,
        });
        expect(getByText(label)).toBeInTheDocument();
        expect(queryByText(subtext)).not.toBeInTheDocument();
        expect(getByTestId('test-child')).toBeInTheDocument();
    });
    it('should render title, subtitle and child', () => {
        const { getByText, getByTestId } = setup({
            label,
            subtext,
            children,
        });
        expect(getByText(label)).toBeInTheDocument();
        expect(getByText(subtext)).toBeInTheDocument();
        expect(getByTestId('test-child')).toBeInTheDocument();
    });
});
