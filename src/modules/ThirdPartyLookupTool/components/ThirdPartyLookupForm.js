import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

export class ThirdPartyLookupForm extends PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
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
        };
    }

    // toggle form open or closed
    _toggleMinimise = () => {
        this.setState({
            isMinimised: !this.state.isMinimised
        });
    };

    _handleSubmitLookup = (event) => {
        if (event && event.key && (event.key !== 'Enter')) return;

        const lookupType = this.props.localeform.lookupType;
        const primaryValue = this.state.primaryValue;
        const secondaryValue = this.state.secondaryValue ? this.state.secondaryValue : undefined;

        this.props.sendInputsToResultComponent(primaryValue, secondaryValue);

        if (this.state.primaryValue !== '' && this.props.actions && this.props.actions.loadThirdPartyLookup) {
            this.props.actions.loadThirdPartyLookup(lookupType, primaryValue, secondaryValue);
        }
    };

    // update state for the form fields on input
    _onChange = (e) => {
        if (typeof e !== 'undefined') {
            this.setState({[e.target.name]: e.target.value});
        }
    };

    render() {
        const txt = {
            title: locale.components.thirdPartyLookupTools.title,
            thisForm: this.props.localeform,
        };
        const { primaryValue, secondaryValue } = this.state;
        const lookupLabel = txt.thisForm.lookupLabel ? txt.thisForm.lookupLabel : 'this form';
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <StandardCard noHeader>
                        <Grid container spacing={24}>
                            <Grid item style={{flexGrow: 1, width: 1}}>
                                <Typography variant={'headline'}>{txt.thisForm.lookupLabel}</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    onClick={this._toggleMinimise}
                                    tooltip={!!this.state.isMinimised
                                        ? locale.components.thirdPartyLookupTools.tooltip.show + ' for ' + lookupLabel
                                        : locale.components.thirdPartyLookupTools.tooltip.hide + ' for ' + lookupLabel
                                    }>
                                    {
                                        !!this.state.isMinimised
                                            ? <KeyboardArrowDown/>
                                            : <KeyboardArrowUp/>
                                    }
                                </IconButton>
                            </Grid>
                        </Grid>
                        <p>{txt.thisForm.tip ? txt.thisForm.tip : ''}</p>
                        {
                            !this.state.isMinimised &&
                            <form>

                                <div>
                                    <h4>{txt.thisForm.primaryField.heading}</h4>
                                    <p>{txt.thisForm.primaryField.tip ? txt.thisForm.primaryField.tip : ''}</p>
                                    <TextField
                                        fullWidth
                                        name={'primaryValue'}
                                        placeholder={txt.thisForm.primaryField.inputPlaceholder ? txt.thisForm.primaryField.inputPlaceholder : ''}
                                        aria-label={txt.thisForm.primaryField.fromAria ? txt.thisForm.primaryField.fromAria : ''}
                                        value={primaryValue}
                                        onChange={this._onChange}
                                        required
                                        className={'primaryValue'}
                                    />
                                </div>
                                {
                                    // not all forms will have a second field
                                    !!txt.thisForm.secondaryField &&
                                        <div>
                                            <h4>{txt.thisForm.secondaryField.heading}</h4>
                                            <p>{txt.thisForm.secondaryField.tip ? txt.thisForm.secondaryField.tip : ''}</p>
                                            <TextField
                                                fullWidth
                                                name={'secondaryValue'}
                                                placeholder={txt.thisForm.secondaryField.inputPlaceholder ? txt.thisForm.secondaryField.inputPlaceholder : ''}
                                                aria-label={txt.thisForm.secondaryField.fromAria ? txt.thisForm.secondaryField.fromAria : ''}
                                                value={secondaryValue}
                                                onChange={this._onChange}
                                                className={'secondaryValue'}
                                            />
                                        </div>
                                }
                                <p>{txt.thisForm.bottomTip ?  txt.thisForm.bottomTip : ''}</p>
                                <Button
                                    children= {txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'}
                                    variant="contained"
                                    aria-label={txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'}
                                    color={'primary'}
                                    onClick={() => this._handleSubmitLookup()}
                                />
                            </form>
                        }
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
