import React from 'react';
import { PropTypes } from 'prop-types';
import Chart from './Chart';

const AuthorsPublicationTypesCountChart = ({ className, series }) => {
    const options = {
        chart: {
            height: 320,
            plotShadow: false,
            plotBorderWidth: 0,
            spacingBottom: 10,
            type: 'pie',
        },
        credits: {
            enabled: false,
        },
        legend: {
            itemStyle: {
                width: 110,
            },
            align: 'center',
            symbolRadius: 0,
            floating: true,
            layout: 'vertical',
            y: -110,
        },
        tooltip: {
            enabled: false,
        },
        title: {
            text: '',
        },
        subtitle: {
            text: '',
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                startAngle: 45,
                dataLabels: {
                    style: {
                        color: '#FFFFFF',
                        textOutline: 'none',
                    },
                    allowOverlap: false,
                    distance: 10,
                    padding: 2,
                    softConnector: true,
                    className: 'pieLabels ',
                    format: '{y}',
                    useHTML: false,
                    enabled: true,
                },
                shadow: false,
                center: ['50%', '50%'],
                size: '90%',
                innerSize: '65%',
                borderColor: 'none',
            },
        },
        series,
    };

    return <Chart className={`${className || ''} authors-publication-types-count-chart`} chartOptions={options} />;
};
AuthorsPublicationTypesCountChart.propTypes = {
    className: PropTypes.string,
    series: PropTypes.array,
};

AuthorsPublicationTypesCountChart.defaultProps = {
    series: [
        {
            name: 'Publications count by type',
            data: [
                ['Journal articles', 200],
                ['Conference papers', 150],
                ['Book chapters', 106],
                ['Books', 30],
                ['Other', 5],
            ],
        },
    ],
};

export default React.memo(AuthorsPublicationTypesCountChart);
