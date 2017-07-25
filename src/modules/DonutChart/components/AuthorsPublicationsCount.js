import React from 'react';
import DonutChart from './DonutChart';

// TODO: chart doesn't look good on mobile view if there's a lot of years/publications - update styles for mobile view - display last 5 years on mobile view?
// TODO: possible feature: cache processed data in browser (per user)

class AuthorsPublicationsCount extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {
                colors: ['#49075E', '#468fcc', '#f28620', '#fff'],
                chart: {
                    backgroundColor: '#ed5c8f',
                    plotBackgroundColor: '#ed5c8f',
                    plotShadow: false,
                    plotBorderWidth: 0,
                    plotPadding: 10,
                    type: 'pie',
                },
                credits: {
                    enabled: false
                },
                legend: {
                    align: 'right',
                    symbolRadius: 0,
                    floating: true,
                    layout: 'vertical',
                    itemStyle: {
                        'font-size': '1.1em',
                        'font-family': 'Roboto',
                        'font-weight': '300',
                        'color': '#FFF',
                        'textOverflow': 'ellipsis',
                        'paddingBottom': '120px'
                    },
                    y: 0
                },
                tooltip: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        showInLegend: true,
                        dataLabels: {
                            distance: 5,
                            overflow: 'none',
                            className: 'pieLabels ',
                            format: '{y}',
                            useHTML: true,
                            enabled: true
                        },
                        shadow: false,
                        center: ['50%', '40%'],
                        size: '80%',
                        innerSize: '70%',
                        borderColor: 'none',
                    },
                },
                series: [{
                    name: 'Document count by type',
                    data: [
                        ['Journal articles', 429.9],
                        ['Conference papers', 112.5],
                        ['Magazine articles', 106.4],
                        ['Other', 129.2]
                    ],
                }]

            }
        };
    }

    render() {
        return (
          <div>
              <DonutChart className="authors-publications-count" chartOptions={this.state.options}/>
          </div>
        );
    }
}

export default AuthorsPublicationsCount;
