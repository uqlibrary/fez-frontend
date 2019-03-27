import Chart from './Chart';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {...testProps};
    return getElement(Chart, props, isShallow);
}

describe('Chart snapshot tests', () => {
    it('it should mount empty chart component', () => {
        const app = setup({
            chartOptions: {
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
            },
        });
        expect(toJson(app)).toMatchSnapshot();
    });

    it('componentDidMount', () => {
        const app = setup({
            chartOptions: {
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
            },
        }, false);

    });
});

