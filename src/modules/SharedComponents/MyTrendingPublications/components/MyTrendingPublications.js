import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {locale} from 'locale';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

export default class MyTrendingPublications extends PureComponent {
    static propTypes = {
        trendingPublicationsList: PropTypes.array,
        loadingTrendingPublications: PropTypes.bool,
        actions: PropTypes.object,
        accountAuthorDetailsLoading: PropTypes.bool
    };

    static defaultProps = {
        trendingPublicationsList: [],
        loadingTrendingPublications: false
    };

    componentDidMount() {
        if (!this.props.accountAuthorDetailsLoading) {
            this.props.actions.searchTrendingPublications();
        }
    }

    render() {
        const txt = locale.components.myTrendingPublications;

        if (this.props.loadingTrendingPublications) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt.loading}/>
                </div>
            );
        }

        return (
            <div  className="trendingPubs">
                <div className="is-pulled-right">
                    <HelpIcon {...txt.help}/>
                </div>
                {
                    this.props.trendingPublicationsList.map(({key, values}, metricIndex) => (
                        <div key={'metrics_' + metricIndex} className="trendingPubsSection">
                            <h2 className="trendingPubsSource">
                                <div className={`fez-icon ${key} xxlarge`}/>
                                {txt.metrics[key].title}
                            </h2>
                            <div className="is-hidden-mobile subTitle">{txt.metrics[key].subtitle}</div>
                            <PublicationsList
                                publicationsList={values}
                                showMetrics
                            />
                        </div>
                    ))
                }
            </div>
        );
    }
}
