import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {locale} from 'locale';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

export default class MyTrendingPublications extends PureComponent {
    static propTypes = {
        account: PropTypes.object.isRequired,
        trendingPublicationsList: PropTypes.array,
        loadingTrendingPublications: PropTypes.bool,
        actions: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.account && this.props.account.id) {
            this.props.actions.searchTrendingPublications();
        }
    }

    render() {
        const txt = locale.components.myTrendingPublications;
        return (
            <div>
                {
                    this.props.loadingTrendingPublications &&
                    <div className="isLoading is-centered">
                        <InlineLoader message={txt.loading}/>
                    </div>
                }
                {
                    !this.props.loadingTrendingPublications &&
                    <div  className="trendingPubs">
                        <div className="is-pulled-right">
                            <HelpIcon {...txt.help}/>
                        </div>
                        {
                            this.props.trendingPublicationsList.map((metric, metricIndex) => (
                                <div key={'metrics_' + metricIndex} className="trendingPubsSection">
                                    <h2 className="trendingPubsSource">
                                        <div className={`fez-icon ${metric.key} xxlarge`}/>
                                        {txt.metrics[metric.key].title}
                                    </h2>
                                    <div className="is-hidden-mobile subTitle">{txt.metrics[metric.key].subtitle}</div>
                                    <PublicationsList
                                        publicationsList={metric.values}
                                        showMetrics
                                    />
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        );
    }
}
