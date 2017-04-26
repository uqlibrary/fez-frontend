import React from 'react';
import {PropTypes} from 'prop-types';

import TimeDisplay from './TimeDisplay';
import './Dashboard.scss';


class Dashboard extends React.Component {
    static propTypes = {
        account: PropTypes.object.isRequired
    };

    componentDidMount() {
        // fetch data to display here
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
                            <span className="display-1">{account.get('title')} {account.get('name')}</span><br />
                            <span className="subhead">{account.get('fullTitle')}</span><br />
                            <span className="body-1">{account.get('school')}</span>
                        </div>
                    </div>
                    <div className="time-display-wrap">
                        <TimeDisplay />
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
