import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {routes} from 'config';
import param from 'can-param';

import {locale} from 'locale';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

export class AdminLookup extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,
        isMinimised: PropTypes.bool,
        lookupResults: PropTypes.object, // recordToFix

        // Event handlers
        onToggleMinimise: PropTypes.func,
    };
    static defaultProps = {
        isMinimised: false,

        onToggleMinimise: () => {},
    }

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

    _toggleMinimise = () => {
        if (!!this.props.onToggleMinimise) {
            this.props.onToggleMinimise();
        }
    };

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

    _handleSubmit = () => {
        const searchQueryParams = {
            lookupType: locale.components.adminLookupToolsForm.incites.lookupType,
            primaryValue: this.state.primaryFieldValue,
            secondaryValue: this.state.secondaryFieldValue
        };
        if (searchQueryParams && this.props.actions && this.props.actions.searchEspacePublications) {
            this.props.actions.searchEspacePublications(searchQueryParams);

            // navigate to search results page
            this.props.history.push({
                pathname: routes.pathConfig.records.search,
                search: param(searchQueryParams),
                state: {...searchQueryParams}
            });
        }
    };

    render() {
        const txt = {
            title: locale.pages.adminLookupToolsForm.title,
            form: locale.components.adminLookupToolsForm.incites // pass this in as props so we can pass in any form
        };
        return (
            <StandardPage title={locale.pages.adminLookupToolsForm.title}>
                <StandardCard className="searchComponent" noHeader>
                    <Grid container spacing={24}>
                        <Grid item style={{flexGrow: 1, width: 1}}>
                            <Typography variant={'headline'}>{txt.form.lookupLabel}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={this._toggleMinimise}
                                tooltip={this.props.isMinimised
                                    ? locale.components.adminLookupToolsForm.tooltip.show
                                    : locale.components.adminLookupToolsForm.tooltip.hide}>
                                {
                                    !!this.props.isMinimised
                                        ? <KeyboardArrowDown/>
                                        : <KeyboardArrowUp/>
                                }
                            </IconButton>
                        </Grid>
                    </Grid>
                    {
                        !this.props.isMinimised &&
                        <Fragment>
                            <Grid container>
                                <form onSubmit={this._handleSubmit}>
                                    <p>{txt.form.tip}</p>
                                    <div>
                                        <h4>{txt.form.primaryField.heading}</h4>
                                        <p>{txt.form.primaryField.tip}</p>
                                        <TextField
                                            fullWidth
                                            name={'lookup'}
                                            placeholder={txt.form.primaryField.inputPlaceholder}
                                            aria-label={txt.form.primaryField.fromAria}
                                            value={this.primaryFieldValue}
                                            required
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
                                                    value={this.secondaryFieldValue}
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
                                {
                                    !!this.props.lookupResults ?
                                        <Grid item xs={12} md={8}>
                                            <StandardCard style={{marginTop: 10}} title={locale.components.adminLookupToolsForm.resultsLabel}>
                                                xxx
                                            </StandardCard>
                                        </Grid>
                                        :
                                        <div>&nbsp;</div>
                                }
                            </Grid>
                        </Fragment>
                    }
                </StandardCard>
            </StandardPage>
        );
    }
}

export default AdminLookup;
