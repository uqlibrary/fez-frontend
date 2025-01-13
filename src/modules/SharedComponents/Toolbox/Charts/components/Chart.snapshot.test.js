import React from 'react';
import Chart from './Chart';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        chartOptions: {},
        ...testProps,
    };
    return rtlRender(<Chart {...props} />);
}

describe('Chart component', () => {
    it('should mount empty chart component', () => {
        const { container } = setup({
            chartOptions: {
                title: {
                    text: null,
                },
                chart: {
                    type: 'column',
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: -45,
                        y: 18,
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Title',
                    },
                    stackLabels: {
                        enabled: true,
                    },
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: -30,
                    y: -10,
                    floating: true,
                    shadow: false,
                },
                tooltip: {},
                plotOptions: {
                    column: {
                        stacking: 'normal',
                    },
                },
                series: [
                    { name: 'Journal Article', data: [] },
                    { name: 'Conference Paper', data: [] },
                    { name: 'Book Chapter', data: [] },
                    { name: 'Book', data: [] },
                    { name: 'Other', data: [] },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('updates', () => {
        const { rerender, container } = setup();
        rerender(<Chart chartOptions={{ title: { text: 'test' } }} />);
        expect(container).toMatchSnapshot();
    });
});
