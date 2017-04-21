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
            <div className="dashboard">
                <div className="layout-container info-summary">
                    <div className="info column align-stretch justify-stretch">
                        <div className="user-information column flex">
                            <span className="display-1">{account.get('title')}&nbsp;{account.get('name')}</span>
                            <span className="subhead">{account.get('fullTitle')}</span>
                            <span className="body-1">{account.get('school')}</span>
                        </div>
                        <div className="message-center">
                            <div className="alert">
                                <TimeDisplay />
                            </div>
                        </div>
                    </div>
                    <div className="image-cover" />
                    <div className="grey-cover" />
                </div>
                <div className="layout-container column row-lg align-stretch">
                    <div className="flex">
                        some data here...
                    </div>
                    <div style={{width: 32, height: 32}} />
                    <div className="flex">
                        some data here...
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
