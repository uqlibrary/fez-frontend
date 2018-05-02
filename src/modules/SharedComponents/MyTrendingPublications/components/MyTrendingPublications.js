import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {locale} from 'locale';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';

import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

export default class MyTrendingPublications extends PureComponent {
    static propTypes = {
        trendingPublicationsList: PropTypes.array
    };

    static defaultProps = {
        trendingPublicationsList: []
    };

    render() {
        const txt = locale.components.myTrendingPublications;
        return (
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
        );
    }
}
