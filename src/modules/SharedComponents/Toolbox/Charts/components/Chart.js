import React from 'react';
import {PropTypes} from 'prop-types';
import {findDOMNode} from 'react-dom';
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
        this.printMedia = window.matchMedia && window.matchMedia('print') || null;
    }

    componentDidMount() {
        if (this.refs && this.refs.chart) {
            this.chart = new Highcharts.Chart(
                findDOMNode(this.refs.chart),
                this.props.chartOptions
            );

            !!this.printMedia && this.printMedia.addListener(this.reflowChart);
        }
    }

    componentDidUpdate() {
        if (this.chart) {
            this.chart.update(this.props.chartOptions);
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
            !!this.printMedia && this.printMedia.removeListener(this.reflowChart);
        }
    }

    reflowChart = () => this.chart.reflow();

    render() {
        return (
            <div className={this.props.className} ref="chart" />
        );
    }
}

export default Chart;


