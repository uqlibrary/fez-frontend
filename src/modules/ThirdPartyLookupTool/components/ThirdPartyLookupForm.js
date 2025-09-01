import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
export const ThirdPartyLookupForm = ({
    actions,
    locale,
    localeform,
    sendInputsToResultComponent,
    isMinimised = true,
}) => {
    const [state, setState] = React.useState({
        isMinimised,
        primaryValue: '',
        secondaryValue: '',
        formDisplay: {},
    });
    const dispatch = useDispatch();

    // toggle form open or closed
    const _toggleMinimise = () => {
        setState(prev => ({ ...prev, isMinimised: !prev.isMinimised }));
    };

    const _handleSubmitLookup = () => {
        const apiType = localeform.apiType;
        const primaryValue = state.primaryValue;
        const secondaryValue = state.secondaryValue ? state.secondaryValue : undefined;
        const formDisplay = {
            lookupLabel: localeform.lookupLabel,
            primaryFieldHeading: localeform.primaryField.heading,
            secondaryFieldHeading:
                !!localeform.secondaryField && !!localeform.secondaryField.heading
                    ? localeform.secondaryField.heading
                    : 'undefined',
            reportSecondaryFieldInOutput: !!localeform.secondaryField && !!localeform.secondaryField.reportInOutput,
        };

        if (state.primaryValue !== '' && actions && actions.loadThirdPartyResults) {
            sendInputsToResultComponent(primaryValue, secondaryValue, formDisplay);
            dispatch(actions.loadThirdPartyResults(apiType, primaryValue, secondaryValue));
        }
    };

    // update state for the form fields on input
    const _onChange = event => {
        setState(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const lookupLabel = !!localeform && !!localeform.lookupLabel ? localeform.lookupLabel : 'this form';
    const txt = {
        title: locale && locale.title ? locale.title : '',
        thisForm: localeform,
        labelShow:
            !!locale && !!locale.tooltip && !!locale.tooltip.show
                ? `${locale.tooltip.show} ${lookupLabel}`
                : `Show form for ${lookupLabel}`,
        labelHide:
            !!locale && !!locale.tooltip && !!locale.tooltip.hide
                ? `${locale.tooltip.hide} ${lookupLabel}`
                : `Hide form for ${lookupLabel}`,
    };

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
                                onClick={_toggleMinimise}
                                tooltip={!!state.isMinimised ? `${txt.labelShow}` : `${txt.labelHide}`}
                                size="large"
                                data-testid="minimise-toggle"
                            >
                                {!!state.isMinimised ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                            </IconButton>
                        </Grid>
                    </Grid>

                    {!state.isMinimised && (
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
                                    value={state.primaryValue}
                                    onChange={_onChange}
                                    required
                                    className={'primaryValue'}
                                />
                            </div>
                            {
                                // not all forms will have a second field
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
                                            value={state.secondaryValue}
                                            onChange={_onChange}
                                            className={'secondaryValue'}
                                        />
                                    </div>
                                )
                            }
                            <p>{txt.thisForm.bottomTip ? txt.thisForm.bottomTip : ''}</p>
                            <Button
                                children={txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'}
                                variant="contained"
                                aria-label={txt.thisForm.submitButtonLabel ? txt.thisForm.submitButtonLabel : 'Submit'}
                                color={'primary'}
                                onClick={_handleSubmitLookup}
                                onKeyPress={_handleSubmitLookup}
                            />
                        </form>
                    )}
                </StandardCard>
            </Grid>
        </Grid>
    );
};
ThirdPartyLookupForm.propTypes = {
    actions: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    localeform: PropTypes.object.isRequired,
    sendInputsToResultComponent: PropTypes.func.isRequired,
    isMinimised: PropTypes.bool,
};

export default ThirdPartyLookupForm;
