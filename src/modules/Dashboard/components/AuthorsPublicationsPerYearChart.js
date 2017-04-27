import React from 'react';
import {PropTypes} from 'prop-types';
import Chart from './Chart';
import Highcharts from 'highcharts';

class AuthorsPublicationsPerYearChart extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        xAxis: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.options = {
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
                    text: 'Total publications'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: -10,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                // TODO: fix formatter display of tooltip
                // formatter: () => {
                //     return '<b>' + this.x + '</b><br/>' +
                //         this.series.name + ': ' + this.y + '<br/>' +
                //         'Total: ' + this.point.stackTotal;
                // }
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: []
        };
    }

    render() {
        this.options.xAxis.categories = this.props.xAxis;
        this.options.series = this.props.data;

        return (
            <Chart chartOptions={this.options} />
        );
    }
}

export default AuthorsPublicationsPerYearChart;
