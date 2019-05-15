import React from 'react';
import {PropTypes} from 'prop-types';
import Highcharts from 'highcharts';
import 'highcharts-exporting';

class Chart extends React.Component {
    static propTypes = {
        chartOptions: PropTypes.object.isRequired,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.chart = null;
        this.chartRef = React.createRef();
        this.printMedia = window.matchMedia && window.matchMedia('print') || null;
    }

    componentDidMount() {
        if (!!this.chartRef.current) {
            this.chart = new Highcharts.Chart(
                this.chartRef.current,
                this.props.chartOptions
            );

            !!this.printMedia && this.printMedia.addListener(this.reflowChart);
        }
    }

    componentDidUpdate() {
        this.chart &&
        this.chart.update(this.props.chartOptions);
    }

    componentWillUnmount() {
        !!this.chart && this.chart.destroy();

        !!this.chart &&
        !!this.printMedia &&
        this.printMedia.removeListener(this.reflowChart);
    }

    reflowChart = () => this.chart.reflow();

    render() {
        return (
            <div className={this.props.className} ref={this.chartRef} />
        );
    }
}

export default Chart;


