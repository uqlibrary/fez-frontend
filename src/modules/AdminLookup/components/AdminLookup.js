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
        this.state = {
            isMinimised: props.isMinimised,
            primaryValue: '',
            secondaryValue: ''
        };
    }

    _toggleMinimise = () => {
        this.setState({
            isMinimised: !this.state.isMinimised
        });
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
            pathname: `${routes.pathConfig.looku}`,
            state: {...this.state}
        });
    };

    _handleSubmit = () => {
        console.log('_handleSubmit');
        const lookupParams = {
            lookupType: locale.components.adminLookupToolsForm.incites.lookupType,
            primaryValue: this.state.primaryFieldValue,
            secondaryValue: this.state.secondaryFieldValue
        };
        if (lookupParams && this.props.actions && this.props.actions.loadAdminLookup) {
            this.props.actions.loadAdminLookup(lookupParams);

            // navigate to search results page
            this.props.history.push({
                pathname: routes.pathConfig.records.search,
                search: param(lookupParams),
                state: {...lookupParams}
            });
        }

        // if (!!this.props.lookupResults) {
        //     this._loadResults();
        // }
    };

    render() {
        const txt = {
            title: locale.pages.adminLookupToolsForm.title,
            form: locale.components.adminLookupToolsForm.incites // pass this in as props so we can pass in any form
        };
        return (
            <StandardPage title={locale.pages.adminLookupToolsForm.title}>
                {/* extract this element to a repeating element */}
                <StandardCard className="searchComponent" noHeader>
                    <Grid container spacing={24}>
                        <Grid item style={{flexGrow: 1, width: 1}}>
                            <Typography variant={'headline'}>{txt.form.lookupLabel}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={this._toggleMinimise}
                                tooltip={!!this.state.isMinimised
                                    ? locale.components.adminLookupToolsForm.tooltip.show
                                    : locale.components.adminLookupToolsForm.tooltip.hide}>
                                {
                                    !!this.state.isMinimised
                                        ? <KeyboardArrowDown/>
                                        : <KeyboardArrowUp/>
                                }
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <p>{txt.form.tip}</p>
                    </Grid>
                    {
                        !this.state.isMinimised &&
                        <Fragment>
                            <Grid container>
                                <form onSubmit={this._handleSubmit}>
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
                                        onClick={this._handleSubmit()}>
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
