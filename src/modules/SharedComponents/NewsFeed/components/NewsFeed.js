import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {locale} from 'locale';
const moment = require('moment');
const dompurify = require('dompurify');
import ReactHtmlParser from 'react-html-parser';

export default class NewsFeed extends PureComponent {
    static propTypes = {
        newsFeedList: PropTypes.array,
        loadingNewsFeedList: PropTypes.bool,
        showNewsCount: PropTypes.number,
        actions: PropTypes.object
    };

    static defaultProps = {
        newsFeedList: [],
        loadingNewsFeedList: true,
        showNewsCount: 3
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

        const allowedHtmlConfig = { ALLOWED_TAGS: ['p', 'strong', 'i', 'u', 's', 'strike', 'sup', 'sub', 'em', 'br', 'b', 'sup', 'sub'], ALLOWED_ATTR: [] };
        const subNewsFeed = this.props.newsFeedList
            .slice(0,
                this.props.newsFeedList.length > this.props.showNewsCount
                    ? this.props.showNewsCount
                    : this.props.newsFeedList.length
            );

        return (
            <StandardCard title={txt.title} className={'newsFeed primaryHeader'}>
                {
                    !this.props.loadingNewsFeedList && subNewsFeed.map((newsItem, index) => (
                        <div key={`newsItem-${index}`} className="newsItemContainer">
                            <div className="dateContainer">
                                <div className="date" item-icon="">
                                    <span className="day">{moment(newsItem.nws_updated_date).format('D')}</span>
                                    <span className="month">{moment(newsItem.nws_updated_date).format('MMM')}</span>
                                    <span className="year">{moment(newsItem.nws_updated_date).format('YYYY')}</span>
                                </div>
                            </div>
                            <p className="newsItemText">
                                <b>{newsItem.nws_title}</b> {ReactHtmlParser(dompurify.sanitize(newsItem.nws_message, allowedHtmlConfig))}
                            </p>
                        </div>
                    ))
                }
            </StandardCard>
        );
    }
}
