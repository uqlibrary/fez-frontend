import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardCard, InlineLoader, StandardRighthandCard} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationListLoadingProgress} from 'modules/PublicationsList';

import {locale, paths} from 'config';

export default class SearchRecordResults extends React.Component {
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

    _showNewRecordForm = () => {
        this.props.history.push(paths.records.add.addNew);
    };

    _cancelWorkflow = () => {
        this.props.history.push(paths.records.add.find);
    };

    _claimPublication = (item) => {
        this.props.actions.setClaimPublication(item);
        this.props.history.push(paths.records.claim);
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
                            <div>{searchResultsTxt.searchResults.text.replace('[noOfResults]', this.props.publicationsList.length).replace('[searchQuery]', this.props.rawSearchQuery)}</div>
                            <PublicationsList publicationsList={this.props.publicationsList} customActions={actions}/>
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
                                    onTouchTap={this._cancelWorkflow}
                                />
                            </div>
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    label={searchResultsTxt.submit}
                                    secondary
                                    fullWidth
                                    autoFocus={this.props.publicationsList.length === 0}
                                    keyboardFocused={this.props.publicationsList.length === 0}
                                    onTouchTap={this._showNewRecordForm}
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
