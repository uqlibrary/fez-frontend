import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';

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
        form: PropTypes.object,

        // Event handlers
        onToggleMinimise: PropTypes.func,
    };
    static defaultProps = {
        isMinimised: false,
        form: locale.components.adminLookupToolsForm.incites, // when we break this out to a subcomponent, we need to instead make it required

        onToggleMinimise: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            isMinimised: props.isMinimised,
            primaryValue: '',
            secondaryValue: ''
        };
    }

    // toggle form open or closed
    _toggleMinimise = () => {
        this.setState({
            isMinimised: !this.state.isMinimised
        });
    };

    _handleSubmitLookup = () => {
        console.log('_handleSubmitLookup');
        const lookupType = this.props.form.lookupType; // locale.components.adminLookupToolsForm.incites.lookupType;
        const primaryValue = this.state.primaryValue;
        const secondaryValue = this.state.secondaryValue;

        if (secondaryValue !== '' && primaryValue !== '' && this.props.actions && this.props.actions.loadAdminLookup) {
            this.props.actions.loadAdminLookup(lookupType, primaryValue, secondaryValue);
        } else if (primaryValue !== '' && this.props.actions && this.props.actions.loadAdminLookup) {
            this.props.actions.loadAdminLookup(lookupType, primaryValue);
        }
    };

    _handleDefaultSubmit = (event) => {
        console.log('_handleDefaultSubmit');
        if(event) event.preventDefault();
    };

    // update state for the form fields on input
    _onChange = (e) => {
        if (typeof e !== 'undefined') {
            this.setState({[e.target.name]: e.target.value});
        }
    };

    render() {
        const txt = {
            title: locale.pages.adminLookupToolsForm.title,
            form: this.props.form, // locale.components.adminLookupToolsForm.incites // in the subcomponent this will let us have a number of forms...
        };
        const { primaryValue, secondaryValue } = this.state;
        return (
            <StandardPage title={locale.pages.adminLookupToolsForm.title}>
                {/* extract this element to a sub element as we want to include several of them */}
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
                                <form onSubmit={this._handleDefaultSubmit}>  {/* onSubmit={this._handleSubmitLookup} > */}
                                    <div>
                                        <h4>{txt.form.primaryField.heading}</h4>
                                        <p>{txt.form.primaryField.tip}</p>
                                        <TextField
                                            fullWidth
                                            name={'primaryValue'}
                                            placeholder={txt.form.primaryField.inputPlaceholder}
                                            aria-label={txt.form.primaryField.fromAria}
                                            value={primaryValue}
                                            onChange={this._onChange}
                                            required
                                        />
                                    </div>
                                    {
                                        // not all forms will have a second field
                                        !!txt.form.secondaryField ?
                                            <div>
                                                <h4>{txt.form.secondaryField.heading}</h4>
                                                <p>{txt.form.secondaryField.tip}</p>
                                                <TextField
                                                    fullWidth
                                                    name={'secondaryValue'}
                                                    placeholder={txt.form.secondaryField.inputPlaceholder}
                                                    aria-label={txt.form.secondaryField.fromAria}
                                                    value={secondaryValue}
                                                    onChange={this._onChange}
                                                />
                                            </div>
                                            :
                                            <div>&nbsp;</div>
                                    }
                                    <p>{txt.form.bottomTip}</p>
                                    <Button
                                        children= {txt.form.submitButtonLabel ? txt.form.submitButtonLabel : 'Submit'}
                                        variant="contained"
                                        aria-label={txt.form.submitButtonLabel}
                                        color={'primary'}
                                        onClick={() => this._handleSubmitLookup()}
                                    />
                                </form>
                                {
                                    !!this.props.lookupResults ?
                                        <Grid item xs={12} md={8}>
                                            <StandardCard style={{marginTop: 10}} title={locale.components.adminLookupToolsForm.resultsLabel}>
                                                tbd
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
