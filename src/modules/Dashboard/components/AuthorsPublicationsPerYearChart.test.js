import React from 'react';
import {PropTypes} from 'prop-types';
import Chart from './Chart';

// TODO: chart doesn't look good on mobile view if there's a lot of years/publications
// TODO: possible update: display last 5 years on mobile view
// TODO: update styles for mobile view
// TODO: handle updated data - will it ever update or always created new?
// TODO: possible feature: cache processed data in browser (per user)


class AuthorsPublicationsPerYearChart extends React.Component {
    static propTypes = {
        rawData: PropTypes.object.isRequired,
        yAxisTitle: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        // TODO: cache/retrieve data if available...

        const categories = this.getCategories([...this.props.rawData.facet_counts.facet_pivot['date_year_t,display_type_i_lookup_exact']]);
        const series = this.getSeries([...this.props.rawData.facet_counts.facet_pivot['date_year_t,display_type_i_lookup_exact']]);

        this.state = {
            options: {
                title: {
                    text: null
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: categories,
                    labels: {
                        rotation: -45,
                        y: 18
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: this.props.yAxisTitle
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
                    // TODO: fix formatter display of tooltip - this.x is no longer in the correct scope
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
                series: series
            }
        };
    }

    /**
     * getCategories - transforms raw academic publication years data into categories, eg years
     * eg [1977, 1980, 1982]
     * @returns {Array}
     */
    getCategories = (rawData) => {
        // return [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

        // extract years and parse year value into int
        const categories = rawData.map((yearData) => { return parseInt(yearData.value, 10); });

        // sort years in ascending order
        categories.sort((yearFirst, yearNext) => { return yearFirst - yearNext; });
        return categories;
    }

    /**
     * getSeries - transforms raw academic publication years data into series formatted data, eg publication type and publications count per year
     * eg [{ 'name': 'Journal Article', 'data': [1, 1, 3]}]
     * @returns {Array}
     */
    getSeries = (rawData) => {
        // [{
        //     'name': 'Journal Article',
        //     'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 7, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5]
        // }, {
        //     'name': 'Conference Paper',
        //     'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 3]
        // }, {
        //     'name': 'Book Chapter',
        //     'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0]
        // }, {
        //     'name': 'Book',
        //     'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // }, {
        //     'name': 'Other',
        //     'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // }];

        // initialise data structure
        const initialValues = new Array(rawData.length).fill(0);
        const fields = {
            'Journal Article': [...initialValues],
            'Conference Paper': [...initialValues],
            'Book Chapter': [...initialValues],
            'Book': [...initialValues],
            'Other': [...initialValues]
        };

        // sort all data by year
        rawData.sort((yearFirst, yearNext) => { return parseInt(yearFirst.value, 10) - parseInt(yearNext.value, 10); });

        // for each year/publication type - extract publication type count
        rawData.map((yearData, yearIndex) => {
            yearData.pivot.map((publicationType) => {
                if (fields[publicationType.value]) {
                    fields[publicationType.value][yearIndex] = publicationType.count;
                } else {
                    fields.Other[yearIndex] += publicationType.count;
                }
            });
        });

        const series = [];

        // construct final data structure
        Object.keys(fields).map(publicationType => {
            series.push({
                name: publicationType,
                data: fields[publicationType]
            });
        });

        return series;
    }

    render() {
        return (
            <Chart className="authors-publications-per-year-chart" chartOptions={this.state.options} />
        );
    }
}

export default AuthorsPublicationsPerYearChart;
