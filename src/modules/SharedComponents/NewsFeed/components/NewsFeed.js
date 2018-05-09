import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {locale} from 'locale';
const moment = require('moment');

export default class NewsFeed extends PureComponent {
    static propTypes = {
        newsFeedList: PropTypes.array,
        loadingNewsFeedList: PropTypes.bool,
        actions: PropTypes.object
    };

    static defaultProps = {
        newsFeedList: [],
        loadingNewsFeedList: true
    };

    componentDidMount() {
        if (this.props.actions && this.props.actions.loadNewsFeed) {
            this.props.actions.loadNewsFeed();
        }
    }

    render() {
        const txt = locale.components.newsFeed;

        if (this.props.loadingNewsFeedList || this.props.newsFeedList.length === 0) {
            return null;
        }

        return (
            <StandardCard title={txt.title} className={'newsFeed with-theme-header'}>
                {
                    !this.props.loadingNewsFeedList &&
                    this.props.newsFeedList.map((newsItem, index) => (
                        <div key={`newsItem-${index}`} className="newsItemContainer">
                            <div className="dateContainer">
                                <div className="date" item-icon="">
                                    <span className="day">{moment(newsItem.nws_updated_date).format('D')}</span>
                                    <span className="month">{moment(newsItem.nws_updated_date).format('MMM')}</span>
                                </div>
                            </div>
                            <p className="newsItemText">
                                <b>{newsItem.nws_title}</b> {newsItem.nws_message}
                            </p>
                        </div>
                    ))
                }
            </StandardCard>
        );
    }
}
