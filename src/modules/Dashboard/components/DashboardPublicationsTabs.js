import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, Tab} from 'material-ui/Tabs';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {MyTrendingPublications} from 'modules/SharedComponents/MyTrendingPublications';
import {MyLatestPublications} from 'modules/SharedComponents/MyLatestPublications';

import {locale} from 'locale';

class DashboardPublicationsTabs extends Component {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        trendingPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        actions: PropTypes.object.isRequired
    };

    static defaultProps = {
        latestPublicationsList: [],
        trendingPublicationsList: [],
        totalPublicationsCount: null,
    };

    componentDidMount() {
        this.props.actions.searchLatestPublications();
        this.props.actions.searchTrendingPublications();
    }

    render() {
        const txt = locale.pages.dashboard;
        const {latestPublicationsList, trendingPublicationsList, totalPublicationsCount} = this.props;

        if (latestPublicationsList.length === 0 && trendingPublicationsList.length === 0) {
            return <div/>;
        }

        return (
            <StandardCard className="card-paddingless">
                <Tabs className="publicationTabs" inkBarStyle={{height: '4px', marginTop: '-4px'}}>
                    {
                        !!latestPublicationsList && latestPublicationsList.length > 0 &&
                        <Tab label={txt.myPublications.title} value="myPublications"
                            className="publicationTabs">
                            <MyLatestPublications
                                latestPublicationsList={latestPublicationsList}
                                totalPublicationsCount={totalPublicationsCount}
                            />
                        </Tab>
                    }
                    {
                        !!trendingPublicationsList && trendingPublicationsList.length > 0 &&
                        <Tab label={txt.myTrendingPublications.title} value="myTrendingPublications"
                            className="publicationTabs">
                            <MyTrendingPublications trendingPublicationsList={trendingPublicationsList}/>
                        </Tab>
                    }
                </Tabs>
            </StandardCard>
        );
    }
}
export default DashboardPublicationsTabs;
