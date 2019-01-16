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

export class AdminLookupForm extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        localeform: PropTypes.object.isRequired,
        isMinimised: PropTypes.bool,
        lookupType: PropTypes.string,
        loadingResults: PropTypes.bool,
    };
    static defaultProps = {
        lookupType: '',
        isMinimised: true,
        loadingResults: false,

        onToggleMinimise: () => {},
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

    _handleSubmitLookup = () => {
        if (event && event.key && (event.key !== 'Enter')) return;

        const lookupType = this.props.localeform.lookupType;
        const primaryValue = this.state.primaryValue;
        const secondaryValue = this.state.secondaryValue ? this.state.secondaryValue : undefined;

        if (this.state.primaryValue !== '' && this.props.actions && this.props.actions.loadAdminLookup) {
            this.props.actions.loadAdminLookup(lookupType, primaryValue, secondaryValue);
        }
    };

    _handleDefaultSubmit = (event) => {
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
            title: locale.components.adminLookupTools.title,
            thisForm: this.props.localeform,
        };
        const { primaryValue, secondaryValue } = this.state;
        return (
            <StandardCard className="lookupComponent" noHeader>
                <Grid container spacing={24}>
                    <Grid item style={{flexGrow: 1, width: 1}}>
                        <Typography variant={'headline'}>{txt.thisForm.lookupLabel}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={this._toggleMinimise}
                            tooltip={!!this.state.isMinimised
                                ? locale.components.adminLookupTools.tooltip.show + ' for ' + txt.thisForm.lookupLabel
                                : locale.components.adminLookupTools.tooltip.hide + ' for ' + txt.thisForm.lookupLabel}>
                            {
                                !!this.state.isMinimised
                                    ? <KeyboardArrowDown/>
                                    : <KeyboardArrowUp/>
                            }
                        </IconButton>
                    </Grid>
                </Grid>
                <p>{txt.thisForm.tip}</p>
                {
                    !this.state.isMinimised &&
                    <form onSubmit={this._handleDefaultSubmit}>

                        <div>
                            <h4>{txt.thisForm.primaryField.heading}</h4>
                            <p>{txt.thisForm.primaryField.tip}</p>
                            <TextField
                                fullWidth
                                name={'primaryValue'}
                                placeholder={txt.thisForm.primaryField.inputPlaceholder}
                                aria-label={txt.thisForm.primaryField.fromAria}
                                value={primaryValue}
                                onChange={this._onChange}
                                required
                            />
                        </div>
                        {
                            // not all forms will have a second field
                            !!txt.thisForm.secondaryField &&
                                <div>
                                    <h4>{txt.thisForm.secondaryField.heading}</h4>
                                    <p>{txt.thisForm.secondaryField.tip}</p>
                                    <TextField
                                        fullWidth
                                        name={'secondaryValue'}
                                        placeholder={txt.thisForm.secondaryField.inputPlaceholder}
                                        aria-label={txt.thisForm.secondaryField.fromAria}
                                        value={secondaryValue}
                                        onChange={this._onChange}
                                    />
                                </div>
                        }
                        <p>{txt.thisForm.bottomTip}</p>
                        <Button
                            children= {txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'}
                            variant="contained"
                            aria-label={txt.thisForm.submitButtonLabel}
                            color={'primary'}
                            onClick={() => this._handleSubmitLookup()}
                            disabled={this.props.loadingResults}
                        />
                    </form>
                }
            </StandardCard>
        );
    }
}
