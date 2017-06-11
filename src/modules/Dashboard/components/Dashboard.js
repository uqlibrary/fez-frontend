import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText, CardHeader} from 'material-ui/Card';
// import {publicationYearsBig as publicationYearsMockData} from '../../../mock/data/academic/publicationYears';

// import {AuthorsPublicationsPerYearChart} from 'uqlibrary-react-toolbox';
import './Dashboard.scss';

import {Chart, DataSeries, Pie} from 'diffract';

const colors = ['#481e5d', '#468fcc', '#f28620', '#FFF'];
const width = 240;
const height = 240;

const getRandomValuesArray = () => ([
    Math.random() * 10000, Math.random() * 10000,
    Math.random() * 10000, Math.random() * 10000
]);

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            values: [Math.random() * 10000, Math.random() * 10000,
                Math.random() * 10000, Math.random() * 10000],

            multiValues: [
                getRandomValuesArray(), getRandomValuesArray(), getRandomValuesArray(), getRandomValuesArray()],

            labels: ['Elves', 'Dwarves', 'Hobbitses', 'Men']
        };
    }


    componentDidMount() {
        // fetch data to display here
    }

    getColors(d, i) {
        if (arguments.length === 2) {
            return colors[i];
        } else {
            return colors[d];
        }
    }

    getPieChart() {
        return (
            <Chart width={width} height={height}>
                <DataSeries data={this.state.values}>
                    <Pie innerRadius={80} outerRadius={110}
                         onClick={(e, v, i) => console.log(this.state.labels[i] + ' clicked')}
                         style={(d, i) => ({fill: this.getColors(i)})}>
                        <text className="donut-title" textAnchor="middle"
                              x={0} y={0} fontSize={18}>
                            {'Hi'}
                        </text>
                        <text className="donut-subtitle" textAnchor="middle"
                              x={0} y={18} fontSize={10}>
                            {'chosen'}
                        </text>
                    </Pie>
                </DataSeries>
            </Chart>
        );
    }

    render() {
        const {
            account
        } = this.props;

        return (
            <div className="layout-fill">
                <div className="layout-card">
                    <div className="image-cover">
                        <div className="user-information" style={{color: '#FFF'}}>
                            <span className="display-1">{account.get('title')} {account.get('name')}</span><br/>
                            <span className="subhead">{account.get('fullTitle')}</span><br/>
                            <span className="body-1">{account.get('school')}</span>
                        </div>
                    </div>
                    <div className="time-display-wrap"/>

                    <div className="columns is-gapless">
                        <div className="column">
                            <Card style={{backgroundColor: '#ED5C8F', marginRight: '10px', marginTop: '20px'}}>
                                <CardHeader className="card-header">
                                    <h2 className="headline" style={{color: '#FFF'}}>eSpace publications by type</h2>
                                </CardHeader>

                                <CardText className="body-1">
                                    <div><br/>
                                        {this.getPieChart()}
                                    </div>
                                </CardText>

                            </Card>
                        </div>
                        <div className="column">
                            <Card style={{marginLeft: '10px', marginTop: '20px'}}>
                                <CardHeader className="card-header">
                                    <h2 className="headline">eSpace publications by year</h2>
                                </CardHeader>

                                <CardText className="body-1">
                                    <div><br/>
                                        Some content
                                    </div>
                                </CardText>

                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
