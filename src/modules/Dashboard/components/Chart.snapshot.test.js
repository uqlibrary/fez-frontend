jest.dontMock('./Chart');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import Chart from './Chart';

function setup(chartOptions) {
    const props = {
        chartOptions
    };
    return shallow(<Chart chartOptions={chartOptions} />);
}


describe('Chart snapshot tests', () => {
    it('it should render empty chart component', () => {
        const app = setup({
            options: {
                title: {
                    text: null
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: -45,
                        y: 18
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Title'
                    },
                    stackLabels: {
                        enabled: true
                    }
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: -30,
                    y: -10,
                    floating: true,
                    shadow: false
                },
                tooltip: {

                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{"name":"Journal Article","data":[]},{"name":"Conference Paper","data":[]},{"name":"Book Chapter","data":[]},{"name":"Book","data":[]},{"name":"Other","data":[]}]
            }
        });

        expect(toJson(app)).toMatchSnapshot();
    });
});

