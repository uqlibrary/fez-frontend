import React from 'react';
import {PropTypes} from 'prop-types';
import {findDOMNode} from 'react-dom';
import Highcharts from 'highcharts';

class Chart extends React.Component {
    static propTypes = {
        chartOptions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.chart = null;
    }

    componentDidMount() {
        this.chart = new Highcharts.Chart(
            findDOMNode(this.refs.chart),
            this.props.chartOptions
        );
    }

    componentDidUpdate() {
        if (this.chart) {
            this.chart.update(this.props.chartOptions);
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    render() {
        return (
            <div ref="chart" />
        );
    }
}

export default Chart;


