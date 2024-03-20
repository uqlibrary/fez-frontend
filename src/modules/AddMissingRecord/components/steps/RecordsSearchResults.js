import React, { Suspense, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// forms & custom components
const PublicationsList = React.lazy(() =>
    import('modules/SharedComponents/PublicationsList/components/PublicationsList'),
);

/* istanbul ignore next */
const PublicationListLoadingProgress = React.lazy(() =>
    import('modules/SharedComponents/PublicationsList/components/LoadingProgress/PublicationListLoadingProgress'),
);

import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';

export default class RecordsSearchResults extends PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        searchLoading: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        navigate: PropTypes.func.isRequired,
        actions: PropTypes.object,
        rawSearchQuery: PropTypes.string,
    };

    static defaultProps = {
        publicationsList: [],
        loadingPublicationSources: {},
    };

    componentDidUpdate() {
        /* istanbul ignore else */
        if (this.showNewRecordButton && this.props.publicationsList.length === 0) {
            this.showNewRecordButton.focus();
        }
    }

    _setRef = node => {
        this.showNewRecordButton = node;
    };

    _showNewRecordForm = () => {
        this.props.navigate(pathConfig.records.add.new);
    };

    _cancelWorkflow = () => {
        this.props.navigate(pathConfig.records.add.find);
    };

    _claimPublication = item => {
        this.props.actions.setClaimPublication(item);
        this.props.actions.setRedirectPath(pathConfig.records.add.find);
        this.props.navigate(pathConfig.records.claim);
    };

    getUnclaimablePublicationsList = publicationsList => {
        return publicationsList
            .filter(item => {
                if (
                    // If the item doesnt have a pid
                    !item.rek_pid ||
                    // If not all of the authors have been assigned by count
                    (item.fez_record_search_key_author_id || []).length !==
                        (item.fez_record_search_key_author || []).length ||
                    // If the item has had contributors assigned, but have unclaimed/unassigned ie. id = 0 or null
                    ((item.fez_record_search_key_contributor_id || []).length > 0 &&
                        item.fez_record_search_key_contributor_id.reduce(
                            (total, item) => total || item.rek_contributor_id === 0 || item.rek_contributor_id === null,
                            false,
                        )) ||
                    // If the item has had authors assigned, but have unclaimed/unassigned ie. id = 0 or null
                    ((item.fez_record_search_key_author_id || []).length > 0 &&
                        item.fez_record_search_key_author_id.reduce(
                            (total, item) => total || item.rek_author_id === 0 || item.rek_author_id === null,
                            false,
                        )) ||
                    // If there are no authors, and not all of the contributors have been assigned by count
                    // Edge case for edited book, where there were no authors but had contributors
                    ((item.fez_record_search_key_author || []).length === 0 &&
                        (item.fez_record_search_key_contributor_id || []).length !==
                            (item.fez_record_search_key_contributor || []).length)
                ) {
                    return false;
                }

                return true;
            })
            .map(item => item.rek_pid);
    };

    render() {
        const searchResultsTxt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: searchResultsTxt.claim,
                handleAction: this._claimPublication,
                primary: true,
                disabled: this.props.searchLoading,
            },
        ];

        const unclaimablePublicationsList = this.getUnclaimablePublicationsList(this.props.publicationsList);
        const unclaimable = [
            {
                label: searchResultsTxt.unclaimable,
                disabled: true,
                primary: false,
            },
        ];

        return (
            <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item xs sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <PublicationListLoadingProgress
                                mobile
                                loadingPublicationSources={this.props.loadingPublicationSources}
                            />
                        </Suspense>
                    </Grid>
                    <Grid item xs sm={8} md={9}>
                        {this.props.searchLoading && <InlineLoader message={searchResultsTxt.loadingMessage} />}
                        {this.props.publicationsList.length > 0 && (
                            <Grid item sm={12}>
                                <StandardCard {...searchResultsTxt.searchResults}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            {searchResultsTxt.searchResults.resultsText
                                                .replace('[noOfResults]', this.props.publicationsList.length)
                                                .replace('[searchQuery]', this.props.rawSearchQuery)}
                                            {searchResultsTxt.searchResults.text}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PublicationsList
                                                publicationsLoading={this.props.searchLoading}
                                                publicationsList={this.props.publicationsList}
                                                customActions={actions}
                                                publicationsListSubset={unclaimablePublicationsList}
                                                subsetCustomActions={unclaimable}
                                                showSources
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        )}
                        {!this.props.searchLoading && this.props.publicationsList.length === 0 && (
                            <Grid item sm={12}>
                                <StandardCard {...searchResultsTxt.noResultsFound}>
                                    {searchResultsTxt.noResultsFound.text}
                                </StandardCard>
                            </Grid>
                        )}
                        {!this.props.searchLoading && (
                            <Grid item sm={12}>
                                <Grid container spacing={2} style={{ marginTop: 12 }}>
                                    <Grid item xs />
                                    <Grid item xs={12} md="auto">
                                        <Button
                                            fullWidth
                                            // variant={'contained'}
                                            onClick={this._cancelWorkflow}
                                        >
                                            {searchResultsTxt.cancel}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md="auto">
                                        <Button
                                            fullWidth
                                            variant={'contained'}
                                            color="primary"
                                            onClick={this._showNewRecordForm}
                                            ref={this._setRef}
                                        >
                                            {searchResultsTxt.submit}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid item sm={4} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <StandardRighthandCard title={searchResultsTxt.searchResults.searchDashboard.title}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <PublicationListLoadingProgress
                                    loadingPublicationSources={this.props.loadingPublicationSources}
                                />
                            </Suspense>
                        </StandardRighthandCard>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
