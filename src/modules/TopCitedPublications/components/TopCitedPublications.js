import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {Tabs, Tab} from 'material-ui/Tabs';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Alert from 'modules/SharedComponents/Toolbox/Alert/components/Alert';

export default class TopCitedPublications extends PureComponent {
    static contextTypes = {
        isMobile: PropTypes.bool
    };

    static propTypes = {
        topCitedPublicationsList: PropTypes.array,
        loadingTopCitedPublications: PropTypes.bool,
        actions: PropTypes.object.isRequired,
        showSourceCountIcon: PropTypes.bool
    };

    static defaultProps = {
        topCitedPublicationsList: [],
        loadingTopCitedPublications: false
    };

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications) {
            this.props.actions.searchTopCitedPublications();
        }
    }

    render() {
        const txt = locale.components.topCitedPublications;

        if (this.props.loadingTopCitedPublications) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt.loading}/>
                </div>
            );
        }

        return (
            <div className={'topCitedPublications'}>
                {!this.props.loadingTopCitedPublications && this.props.topCitedPublicationsList.length > 0 ?
                    <StandardCard>
                        <Tabs className="publicationTabs" inkBarStyle={{height: '4px', marginTop: '-4px'}}>
                            {
                                this.props.topCitedPublicationsList.sort((source1, source2) => (
                                    txt[source1.key].order - txt[source2.key].order
                                )).map(({key, values}, metricIndex) => (
                                    <Tab key={key}
                                        label={this.context.isMobile ? txt[key].mobileTitle : txt[key].title}
                                        value={`${key}TopCitedPublications`}
                                        className="publicationTab"
                                    >
                                        <div className="publicationTabContent">
                                            <div>
                                                <div className="is-pulled-right">
                                                    <HelpIcon {...locale.components.trendingPublicationHelp}/>
                                                </div>
                                                <div key={'metrics_' + metricIndex} className="trendingPubsSection">
                                                    <h2 className="trendingPubsSource">
                                                        <div className={`fez-icon ${key} xxlarge`}/>
                                                        {txt[key].heading}
                                                    </h2>
                                                    <div className="is-hidden-mobile subTitle">{txt[key].subHeading}</div>
                                                    <PublicationsList
                                                        publicationsList={values}
                                                        showMetrics
                                                        showSourceCountIcon={key === 'altmetric'}
                                                        hideCountDiff={key === 'altmetric'}
                                                        hideCitationContent
                                                        missingText={txt.missing}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>
                                ))
                            }
                        </Tabs>
                    </StandardCard>
                    :
                    <Alert {...txt.notAvailableAlert} />
                }
            </div>
        );
    }
}


