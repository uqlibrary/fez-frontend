import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {trendingPublicationsConfig} from 'config';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

export default class TopCitedPublications extends PureComponent {
    static propTypes = {
        topCitedPublicationsList: PropTypes.array,
        loadingTopCitedPublications: PropTypes.bool,
        source: PropTypes.string,
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
            source: this.props.source,
            sortBy: trendingPublicationsConfig.source[this.props.source].sortBy,
            sortDirection: trendingPublicationsConfig.source[this.props.source].sortDirection
        };
    }

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications) {
            this.props.actions.searchTopCitedPublications({...this.state});
        }
    }

    intervalChanged =  (event, index, value) => {
        this.setState({
            interval: value
        });
        this.props.actions.searchTopCitedPublications({...this.state});
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

        const publications = this.props.topCitedPublicationsList.filter(item => item.key === source);

        return (
            <div className="topCitedPubs">
                <div className="is-pulled-right">
                    <HelpIcon {...locale.components.trendingPublicationHelp}/>
                </div>
                {
                    publications.length > 0 &&
                    <div className="topCitedPubsSection">
                        <h2 className="trendingPubsSource">
                            <div className={`fez-icon ${source} xxlarge`}/>
                            {txt[source].heading}
                        </h2>
                        <div className="is-hidden-mobile subTitle">{txt[source].subHeading}</div>
                        {
                            source === 'altmetric' &&
                            <div className="column">
                                <SelectField
                                    id="filterBy"
                                    fullWidth
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
                        }
                        <PublicationsList
                            publicationsList={publications[0].values}
                            showMetrics
                        />
                    </div>
                }
            </div>
        );
    }
}


