import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardRighthandCard} from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';


// forms & custom components
import Async from 'modules/SharedComponents/Async';
const PublicationsList = (componentProps) => (<Async load={import('modules/SharedComponents/PublicationsList/components/PublicationsList')}  componentProps={componentProps} />);
const PublicationListLoadingProgress = (componentProps) => (<Async load={import('modules/SharedComponents/PublicationsList/components/LoadingProgress/PublicationListLoadingProgress')}  componentProps={componentProps} />);

import {routes} from 'config';
import {locale} from 'locale';

export default class RecordsSearchResults extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,
        rawSearchQuery: PropTypes.string
    };

    static defaultProps = {
        publicationsList: [],
        loadingPublicationSources: {}
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return  nextProps.loadingSearch !== this.props.loadingSearch
        || nextProps.rawSearchQuery !== this.props.rawSearchQuery
        || nextProps.loadingPublicationSources !== this.props.loadingPublicationSources
        || nextProps.publicationsList !== this.props.publicationsList;
    }

    _showNewRecordForm = () => {
        this.props.history.push(routes.pathConfig.records.add.new);
    };

    _cancelWorkflow = () => {
        this.props.history.push(routes.pathConfig.records.add.find);
    };

    _claimPublication = (item) => {
        this.props.actions.setClaimPublication(item);
        this.props.history.push(routes.pathConfig.records.claim);
    };

    render() {
        const searchResultsTxt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: searchResultsTxt.claim,
                handleAction: this._claimPublication,
                primary: true
            }
        ];

        const unclaimablePublicationsList = this.props.publicationsList
            .filter(item => {
                // If the item doesnt have a pid
                if (!item.rek_pid) return false;
                // If not all of the authors have been assigned by count
                if (item.fez_record_search_key_author_id.length !== item.fez_record_search_key_author.length) return false;
                // If there are no authors, and not all of the contributors have been assigned by count
                if (item.fez_record_search_key_author.length === 0 &&
                    (item.fez_record_search_key_contributor_id.length !== item.fez_record_search_key_contributor.length)) return false;
                // If the item has had contributors or authors assigned, but have unclaimed/unassigned ie. id = 0
                if (item.fez_record_search_key_contributor_id.length > 0 && item.fez_record_search_key_contributor_id.reduce((total, item)=>(total || item.rek_contributor_id === 0))) return false;
                return (item.fez_record_search_key_author_id.length > 0 && item.fez_record_search_key_author_id.reduce((total, item)=>(total || item.rek_author_id === 0), false));
            })
            .map(item => (item.rek_pid));

        const unclaimable = [
            {
                label: searchResultsTxt.unclaimable,
                disabled: true,
                primary: false
            }
        ];

        return (
            <div className="columns searchWrapper">
                {/* Mobile search dashboard (progress bar) */}
                <div className="column is-hidden-desktop is-hidden-tablet mobileWrapper">
                    <PublicationListLoadingProgress
                        mobile
                        loadingPublicationSources={this.props.loadingPublicationSources} />
                </div>
                {/* Search results */}
                <div className="column">
                    {
                        this.props.loadingSearch &&
                        <div className="is-centered"><InlineLoader message={searchResultsTxt.loadingMessage}/></div>
                    }
                    {
                        this.props.publicationsList.length > 0 &&
                        <StandardCard {...searchResultsTxt.searchResults}>
                            <div>
                                {
                                    searchResultsTxt.searchResults.resultsText
                                        .replace('[noOfResults]', this.props.publicationsList.length)
                                        .replace('[searchQuery]', this.props.rawSearchQuery)
                                }
                            </div>
                            <div>
                                {searchResultsTxt.searchResults.text}
                            </div>
                            <PublicationsList
                                publicationsList={this.props.publicationsList}
                                customActions={actions}
                                publicationsListSubset={unclaimablePublicationsList}
                                subsetCustomActions={unclaimable}
                                showSources />
                        </StandardCard>
                    }
                    {
                        !this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                        <StandardCard {...searchResultsTxt.noResultsFound}>
                            {searchResultsTxt.noResultsFound.text}
                        </StandardCard>
                    }

                    {
                        !this.props.loadingSearch &&
                        <div className="columns action-buttons">
                            <div className="column is-hidden-mobile"/>
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    fullWidth
                                    label={searchResultsTxt.cancel}
                                    onClick={this._cancelWorkflow}
                                />
                            </div>
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    label={searchResultsTxt.submit}
                                    secondary
                                    fullWidth
                                    autoFocus={this.props.publicationsList.length === 0}
                                    keyboardFocused={this.props.publicationsList.length === 0}
                                    onClick={this._showNewRecordForm}
                                />
                            </div>
                        </div>
                    }
                </div>
                {/* Desktop search dashboard */}
                <div className="column is-3-desktop is-4-tablet is-hidden-mobile">
                    <StandardRighthandCard title={searchResultsTxt.searchResults.searchDashboard.title}>
                        <PublicationListLoadingProgress loadingPublicationSources={this.props.loadingPublicationSources}/>
                    </StandardRighthandCard>
                </div>
            </div>
        );
    }
}
