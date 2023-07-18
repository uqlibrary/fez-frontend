import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import {locale} from 'locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';

export class ThirdPartyLookupForm extends PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object.isRequired,
        localeform: PropTypes.object.isRequired,
        sendInputsToResultComponent: PropTypes.func.isRequired,
        isMinimised: PropTypes.bool,
    };
    static defaultProps = {
        isMinimised: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            isMinimised: props.isMinimised,
            primaryValue: '',
            secondaryValue: '',
            formDisplay: {},
        };
    }

    // toggle form open or closed
    _toggleMinimise = () => {
        this.setState({
            isMinimised: !this.state.isMinimised,
        });
    };

    _handleSubmitLookup = () => {
        const apiType = this.props.localeform.apiType;
        const primaryValue = this.state.primaryValue;
        const secondaryValue = this.state.secondaryValue ? this.state.secondaryValue : undefined;
        const formDisplay = {
            lookupLabel: this.props.localeform.lookupLabel,
            primaryFieldHeading: this.props.localeform.primaryField.heading,
            secondaryFieldHeading:
                !!this.props.localeform.secondaryField && !!this.props.localeform.secondaryField.heading
                    ? this.props.localeform.secondaryField.heading
                    : 'undefined',
            reportSecondaryFieldInOutput:
                !!this.props.localeform.secondaryField && !!this.props.localeform.secondaryField.reportInOutput,
        };

        if (this.state.primaryValue !== '' && this.props.actions && this.props.actions.loadThirdPartyResults) {
            this.props.sendInputsToResultComponent(primaryValue, secondaryValue, formDisplay);
            this.props.actions.loadThirdPartyResults(apiType, primaryValue, secondaryValue);
        }
    };

    // update state for the form fields on input
    _onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const lookupLabel =
            !!this.props.localeform && !!this.props.localeform.lookupLabel
                ? this.props.localeform.lookupLabel
                : 'this form';
        const txt = {
            title: this.props.locale && this.props.locale.title ? this.props.locale.title : '',
            thisForm: this.props.localeform,
            labelShow:
                !!this.props.locale && !!this.props.locale.tooltip && !!this.props.locale.tooltip.show
                    ? `${this.props.locale.tooltip.show} ${lookupLabel}`
                    : `Show form for ${lookupLabel}`,
            labelHide:
                !!this.props.locale && !!this.props.locale.tooltip && !!this.props.locale.tooltip.hide
                    ? `${this.props.locale.tooltip.hide} ${lookupLabel}`
                    : `Hide form for ${lookupLabel}`,
        };
        const { primaryValue, secondaryValue } = this.state;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard noHeader>
                        <Grid container spacing={3}>
                            <Grid item style={{ flexGrow: 1, width: 1 }}>
                                <Typography variant="h5">{lookupLabel}</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    onClick={this._toggleMinimise}
                                    tooltip={!!this.state.isMinimised ? `${txt.labelShow}` : `${txt.labelHide}`}
                                    size="large"
                                    data-testid="minimise-toggle"
                                >
                                    {!!this.state.isMinimised ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                                </IconButton>
                            </Grid>
                        </Grid>

                        {!this.state.isMinimised && (
                            <form>
                                <p>{txt.thisForm.tip ? txt.thisForm.tip : ''}</p>
                                <div>
                                    <h4>{txt.thisForm.primaryField.heading}</h4>
                                    <p>{txt.thisForm.primaryField.tip ? txt.thisForm.primaryField.tip : ''}</p>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        name={'primaryValue'}
                                        placeholder={
                                            txt.thisForm.primaryField.inputPlaceholder
                                                ? txt.thisForm.primaryField.inputPlaceholder
                                                : ''
                                        }
                                        inputProps={{
                                            'aria-label': txt.thisForm.primaryField.fromAria || '',
                                        }}
                                        value={primaryValue}
                                        onChange={this._onChange}
                                        required
                                        className={'primaryValue'}
                                    />
                                </div>
                                {// not all forms will have a second field
                                !!txt.thisForm.secondaryField && (
                                    <div>
                                        <h4>{txt.thisForm.secondaryField.heading}</h4>
                                        <p>{txt.thisForm.secondaryField.tip ? txt.thisForm.secondaryField.tip : ''}</p>
                                        <TextField
                                            variant="standard"
                                            fullWidth
                                            name={'secondaryValue'}
                                            inputProps={{
                                                'aria-label': txt.thisForm.secondaryField.fromAria || '',
                                            }}
                                            placeholder={
                                                txt.thisForm.secondaryField.inputPlaceholder
                                                    ? txt.thisForm.secondaryField.inputPlaceholder
                                                    : ''
                                            }
                                            value={secondaryValue}
                                            onChange={this._onChange}
                                            className={'secondaryValue'}
                                        />
                                    </div>
                                )}
                                <p>{txt.thisForm.bottomTip ? txt.thisForm.bottomTip : ''}</p>
                                <Button
                                    children={
                                        txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'
                                    }
                                    variant="contained"
                                    aria-label={
                                        txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'
                                    }
                                    color={'primary'}
                                    onClick={this._handleSubmitLookup}
                                    onKeyPress={this._handleSubmitLookup}
                                />
                            </form>
                        )}
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
