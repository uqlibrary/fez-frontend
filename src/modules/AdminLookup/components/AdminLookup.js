import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {routes} from 'config';
import param from 'can-param';

import Grid from '@material-ui/core/Grid';

import {} from 'modules/SharedComponents/PublicationsList';

import {locale} from 'locale';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class AdminLookup extends PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object,
        publicationsList: PropTypes.array,
        publicationsListFacets: PropTypes.object,
        publicationsListPagingData: PropTypes.object,
        exportPublicationsLoading: PropTypes.bool,
        canUseExport: PropTypes.bool,
        searchLoading: PropTypes.bool,
        searchLoadingError: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[1].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {}
            },
            advancedSearchFields: []
        };

        if (!!props.location && props.location.search.indexOf('?') >= 0) {
            const providedSearchQuery = this.parseSearchQueryStringFromUrl(props.location.search.substr(1));
            this.initState = {...this.initState, ...providedSearchQuery};
        }

        this.state = {
            // check if search has results
            // facets filtering might return no results, but facets should still be visible
            // hasResults: !props.searchLoading && props.publicationsList.length > 0,
            ...this.initState,
        };
    }

    pageChanged = (page) => {
        this.setState(
            {
                page: page
            },
            this.updateHistoryAndSearch
        );
    };

    updateHistory = () => {
        this.props.history.push({
            pathname: `${routes.pathConfig.records.search}`,
            search: param(this.state),
            state: {...this.state}
        });
    };

    render() {
        const txt = {
            title: 'Lookup Tools',
            form: locale.components.adminLookupToolsForm.incites
        };
        return (
            <StandardPage className="page-admin-lookup" title={txt.title}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <StandardCard className="searchComponent" noHeader>
                            <form action="/lookupresult" method="post">
                                <h3>{txt.form.lookupLabel}</h3>
                                <p>{txt.form.tip}</p>
                                <div>
                                    <input type="hidden" name="lookupType" value="{txt.form.lookupType}" />
                                </div>
                                <div>
                                    <h4>{txt.form.primaryField.heading}</h4>
                                    <p>{txt.form.primaryField.tip}</p>
                                    <TextField
                                        fullWidth
                                        name={'lookup'}
                                        placeholder={txt.form.primaryField.inputPlaceholder}
                                        aria-label={txt.form.primaryField.fromAria}
                                    />
                                </div>
                                {
                                    !!txt.form.secondaryField ?
                                        <div>
                                            <h4>{txt.form.secondaryField.heading}</h4>
                                            <TextField
                                                fullWidth
                                                name={'lookup'}
                                                placeholder={txt.form.secondaryField.inputPlaceholder}
                                                aria-label={txt.form.secondaryField.fromAria}
                                            />
                                            <p>{txt.form.secondaryField.tip}</p>
                                        </div>
                                        :
                                        <div>&nbsp;</div>
                                }
                                <p>{txt.form.bottomTip}</p>
                                <Button
                                    children={txt.form.submitButtonLabel}
                                    variant="contained"
                                    aria-label={txt.form.submitButtonLabel}
                                    color={'primary'}
                                    onClick={this._loadResults}>
                                    {txt.form.submitButtonLabel}
                                </Button>
                            </form>
                        </StandardCard>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}

export default AdminLookup;
