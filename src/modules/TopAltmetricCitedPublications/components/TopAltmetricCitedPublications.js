import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {trendingPublicationsConfig} from 'config';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

export default class TopAltemtricCitedPublications extends PureComponent {
    static propTypes = {
        source: PropTypes.string,
        topCitedPublicationsList: PropTypes.array,
        loadingTopCitedPublications: PropTypes.bool,
        actions: PropTypes.object.isRequired
    };

    static defaultProps = {
        source: 'altmetric',
        topCitedPublicationsList: [],
        loadingTopCitedPublications: false
    };

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 20,
            interval: '1m',
            source: props.source
        }
    }

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications) {
            this.fetchData();
        }
    }

    intervalChanged =  (event, index, value) => {
        this.setState({
            interval: value
        });
        this.fetchData();
    }

    fetchData = () => {
        this.props.actions.searchTopAltmetricCitedPublications(this.state.interval);
    }

    render() {
        const {source} = this.props;
        const txt = locale.components.topCitedPublications;

        if (this.props.loadingTopCitedPublications) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt[source].loading}/>
                </div>
            );
        }

        const publications = this.props.topCitedPublicationsList;

        return (
            <div className="topCitedPubs">
                <div className="is-pulled-right">
                    <HelpIcon {...locale.components.trendingPublicationHelp}/>
                </div>
                {
                    publications.length > 0 &&
                    <div className="trendingPubsSection">
                        <h2 className="trendingPubsSource">
                            <div className={`fez-icon ${source} xxlarge`}/>
                            {txt[source].heading}
                        </h2>

                        <div className="columns is-gapless is-hidden-mobile subTitle">
                            <div className={'column is-narrow'}>
                                {txt[source].subHeading}
                            </div>
                            <div className={'column'}>
                                <SelectField
                                    className={'filterByInterval'}
                                    id="filterByInterval"
                                    autoWidth
                                    maxHeight={250}
                                    onChange={this.intervalChanged}
                                    value={this.state.interval}>
                                    {
                                        txt[source].intervals.map((item, index) => (
                                            <MenuItem key={index} value={item.value} primaryText={item.label}/>
                                        ))
                                    }
                                </SelectField>
                            </div>
                        </div>
                        <PublicationsList
                            publicationsList={publications}
                            showMetrics
                            showSourceCountIcon
                            hideCountDiff
                            hideCitationContent/>
                    </div>
                }
            </div>
        );
    }
}


