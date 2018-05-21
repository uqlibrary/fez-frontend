import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {trendingPublicationsConfig} from 'config';
import {locale} from 'locale';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

export default class TopCitedPublications extends PureComponent {
    static propTypes = {
        topCitedPublicationsList: PropTypes.object,
        loadingTopCitedPublications: PropTypes.object,
        source: PropTypes.string,
        actions: PropTypes.object.isRequired
    };

    static defaultProps = {
        source: 'scopus',
        topCitedPublicationsList: {
            scopus: [],
            thomson: []
        },
        loadingTopCitedPublications: {
            scopus: false,
            thomson: false
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 20,
            source: props.source
        };
    }

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications[this.props.source]) {
            this.props.actions.searchTopCitedPublications({...this.state});
        }
    }

    render() {
        const {source} = this.props;
        const txt = locale.components.topCitedPublications;

        if (this.props.loadingTopCitedPublications[source]) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt[source].loading}/>
                </div>
            );
        }

        const publications = this.props.topCitedPublicationsList[source];

        return (
            <div className="topCitedPubs">
                <div className="is-pulled-right">
                    <HelpIcon {...locale.components.trendingPublicationHelp}/>
                </div>
                {
                    publications && publications.length > 0 &&
                    <div className="trendingPubsSection">
                        <h2 className="trendingPubsSource">
                            <div className={`fez-icon ${source} xxlarge`}/>
                            {txt[source].heading}
                        </h2>

                        <div className="columns is-gapless is-hidden-mobile subTitle">
                            <div className={'column is-narrow'}>
                                {txt[source].subHeading}
                            </div>
                        </div>
                        <PublicationsList
                            publicationsList={publications}
                            showMetrics
                            hideCitationContent
                        />
                    </div>
                }
            </div>
        );
    }
}


