import React from 'react';

import { render, preview } from 'test-utils';
import { adminDashboardToday } from 'mock/data/testing/adminDashboard';

import RibbonChartContainer from './RibbonChartContainer';

const locale = {
    title: 'System Alerts',
    total: { label: 'Total' },
    today: {
        label: 'New today',
    },
    assigned: {
        label: 'Assigned',
        suffix: (total, value) => (!!total && !!value && ` (${(value / total) * 100}%)`) || '',
    },
    unassigned: {
        label: 'Unassigned',
        suffix: (total, value) => (!!total && !!value && ` (${(value / total) * 100}%)`) || '',
    },
};

const setup = (props = {}, renderer = render) => {
    const testProps = {
        locale,
        ...props,
    };
    return renderer(<RibbonChartContainer {...testProps} />);
};

describe('RibbonChartContainer', () => {
    const label = 'Test label';
    const children = <div data-testid="test-child">Test child</div>;

    it('should render title and child only', () => {
        const { getByText, queryByTestId } = setup({
            label,
        });
        expect(getByText(label)).toBeInTheDocument();
        expect(queryByTestId('test-child')).not.toBeInTheDocument();
        preview.debug();
    });

    it('should render component', () => {
        const data = adminDashboardToday.systemalerts;
        const { container, getByText, getByTestId } = setup({
            label,
            data,
            children,
            colours: {},
            'data-testid': 'testTable',
        });
        expect(getByText(label)).toBeInTheDocument();
        expect(getByTestId('test-child')).toBeInTheDocument();
        expect(getByTestId('testTable')).toBeInTheDocument();

        // check table header count
        const headerExpected = Object.keys(locale).length;
        const headerActual = container.querySelectorAll('thead th').length;
        expect(headerExpected).toBe(headerActual);

        // check table cell count
        const rowActual = container.querySelectorAll('tbody td').length;
        expect(headerExpected).toBe(rowActual);

        // check specific cell values
        expect(container.querySelectorAll('tbody td')[1]).toHaveTextContent('150');
        expect(container.querySelectorAll('tbody td')[2]).toHaveTextContent('25');
        expect(container.querySelectorAll('tbody td')[3]).toHaveTextContent('15 (10%');
        expect(container.querySelectorAll('tbody td')[4]).toHaveTextContent('135 (90%)');
    });

    // it('should render component', () => {
    //     const data = adminDashboardToday.systemalerts;
    //     const { container, getByText, getByTestId } = setup({
    //         label,
    //         data,
    //         children,
    //         colours: {},
    //         'data-testid': 'testTable',
    //     });
    //     expect(getByText(label)).toBeInTheDocument();
    //     expect(getByTestId('test-child')).toBeInTheDocument();
    //     expect(getByTestId('testTable')).toBeInTheDocument();

    //     // check table header count
    //     const headerExpected = Object.keys(locale).length;
    //     const headerActual = container.querySelectorAll('thead th').length;
    //     expect(headerExpected).toBe(headerActual);

    //     // check table cell count
    //     const rowActual = container.querySelectorAll('tbody td').length;
    //     expect(headerExpected).toBe(rowActual);

    //     // check specific cell values
    //     expect(container.querySelectorAll('tbody td')[1]).toHaveTextContent('150');
    //     expect(container.querySelectorAll('tbody td')[2]).toHaveTextContent('25');
    //     expect(container.querySelectorAll('tbody td')[3]).toHaveTextContent('15 (10%');
    //     expect(container.querySelectorAll('tbody td')[4]).toHaveTextContent('135 (90%)');
    // });

    it('should render colours', () => {
        const data = adminDashboardToday.systemalerts;
        const { container, getByText, getByTestId } = setup({
            label,
            data,
            children,
            colours: { total: '#FF0000', today: '#00FF00', assigned: '#0000FF', unassigned: '#000000' },
            'data-testid': 'testTable',
        });
        expect(getByText(label)).toBeInTheDocument();
        expect(getByTestId('test-child')).toBeInTheDocument();
        expect(getByTestId('testTable')).toBeInTheDocument();

        // check specific header cell colours
        expect(container.querySelectorAll('thead th')[1]).toHaveStyle('border-bottom: 3px solid #FF0000');
        expect(container.querySelectorAll('thead th')[2]).toHaveStyle('border-bottom: 3px solid #00FF00');
        expect(container.querySelectorAll('thead th')[3]).toHaveStyle('border-bottom: 3px solid #0000FF');
        expect(container.querySelectorAll('thead th')[4]).toHaveStyle('border-bottom: 3px solid #000000');

        preview.debug();
    });
});
