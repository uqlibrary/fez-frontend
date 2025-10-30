import React from 'react';
import { render, waitFor } from '@testing-library/react';
import LazyChart from './LazyChart';

// Mock the LazyLoadSuspense component
jest.mock('modules/SharedComponents/LazyLoadSuspense', () => {
    return function LazyLoadSuspense({ children }) {
        return <div data-testid="lazy-load-suspense">{children}</div>;
    };
});

describe('LazyChart', () => {
    it('should render the lazy-loaded Chart', async () => {
        const mockChartOptions = {
            title: { text: 'Test Chart' },
            series: [{ data: [1, 2, 3] }],
        };

        const { container } = render(<LazyChart chartOptions={mockChartOptions} className="test-chart" />);

        await waitFor(() => {
            expect(container.querySelector('.test-chart')).toBeInTheDocument();
        });
    });

    it('should pass chartOptions and className props to Chart', async () => {
        const mockChartOptions = {
            title: { text: 'Test Chart' },
            chart: { type: 'bar' },
        };

        const { container } = render(<LazyChart chartOptions={mockChartOptions} className="custom-class" />);

        await waitFor(() => {
            const chartElement = container.querySelector('.custom-class');
            expect(chartElement).toBeInTheDocument();
        });
    });
});
