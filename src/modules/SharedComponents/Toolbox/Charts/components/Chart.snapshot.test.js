import Chart from './Chart';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        chartOptions: {},
        ...testProps
    };
    return getElement(Chart, props, isShallow);
}

describe('Chart component', () => {
    it('should mount empty chart component', () => {
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
                series: [
                    {"name":"Journal Article","data":[]},
                    {"name":"Conference Paper","data":[]},
                    {"name":"Book Chapter","data":[]},
                    {"name":"Book","data":[]},
                    {"name":"Other","data":[]}
                ]
            },
        });
        expect(toJson(app)).toMatchSnapshot();
    });

    it('should set printMedia property', () => {
        const test = jest.fn();
        window.matchMedia = test;
        setup({});
        expect(test).toBeCalled();
    });

    it('componentDidMount', () => {
        const wrapper = setup({});
        const test = jest.fn();
        wrapper.instance().printMedia = {
            addListener: test
        };
        wrapper.instance().chartRef.current = true;
        wrapper.instance().componentDidMount();
        expect(test).toBeCalled();
    });

    it('componentDidUpdate', () => {
        const wrapper = setup({});
        const test = jest.fn();
        wrapper.instance().chart = {
            update: test
        };
        wrapper.instance().componentDidUpdate();
        expect(test).toBeCalled();
    });

    it('componentWillUnmount', () => {
        const wrapper = setup({});
        const test = jest.fn();
        wrapper.instance().chart = {
            destroy: test
        };
        wrapper.instance().printMedia = {
            removeListener: test
        }
        wrapper.instance().componentWillUnmount();
        expect(test).toBeCalledTimes(2);
    });

    it('reflowChart', () => {
        const wrapper = setup({});
        const test = jest.fn();
        wrapper.instance().chart = {
            reflow: test
        };
        wrapper.instance().reflowChart();
        expect(test).toBeCalled();
    });
});

