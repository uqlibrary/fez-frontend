import React from 'react';
import { PropTypes } from 'prop-types';
import Chart from './Chart';

export function labelFormatter() {
    if (!this?.userOptions) {
        return '';
    }
    const name = this.userOptions.name;
    const extras = (this.userOptions.extraInfoForLegend || '').split(', ');
    return extras.join('').length ? `${name} (${extras.join(', <br />')})` : name;
}

const AuthorsPublicationsPerYearChart = ({
    yAxisTitle = 'Total publications',
    series = [],
    categories = [],
    className,
}) => {
    const options = {
        title: {
            text: null,
        },
        chart: {
            type: 'column',
            height: 320,
            backgroundColor: 'transparent',
        },
        plotOptions: {
            column: {
                stacking: 'normal',
            },
        },
        xAxis: {
            categories: categories,
            labels: {
                rotation: -45,
                y: 18,
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxisTitle,
            },
            stackLabels: {
                enabled: true,
            },
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            x: -30,
            y: -10,
            floating: true,
            shadow: false,
            itemStyle: {
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '16px',
            },
            labelFormatter,
            symbolHeight: 12,
            symbolWidth: 12,
            itemMarginTop: -6,
            itemMarginBottom: -6,
            navigation: {
                enabled: false,
            },
        },
        series,
    };

    return <Chart className={`${className || ''} authors-publications-per-year-chart`} chartOptions={options} />;
};
AuthorsPublicationsPerYearChart.propTypes = {
    yAxisTitle: PropTypes.string,
    series: PropTypes.array,
    categories: PropTypes.array,
    className: PropTypes.string,
};

export default React.memo(AuthorsPublicationsPerYearChart);
