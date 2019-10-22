import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useFormValuesContext } from 'context';

import { mui1theme as theme } from 'config';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import TextField from '@material-ui/core/TextField';

import { PolicyDropdown } from './PolicyDropdown';

const DataStreamSecurityItem = ({
    dataStream,
    classes,
    clearDateHint,
    index,
    disabled,
    onSecurityChange,
    initialDataStream,
    inheritedSecurity,
    onEmbargoClearPromptText,
    policyDropdownLabel,
}) => {
    const { formValues } = useFormValuesContext();

    const [hasClearedEmbargoDate, markEmbargoDateAsCleared] = useState(false);

    const handleDataStreamChange = value => {
        onSecurityChange(
            index,
            value.dsi_security_policy === initialDataStream.dsi_security_policy
                ? initialDataStream
                : {
                    ...dataStream,
                    ...value,
                    dsi_security_inherited: 0,
                },
        );
    };

    const minimumSecurityPolicyForRecord = () => {
        return formValues.rek_security_policy;
    };

    const handlePolicyChange = value => {
        handleDataStreamChange({
            dsi_security_inherited: 0,
            dsi_security_policy: value,
        });
                    ...value,
                },
        );
    };

    const minimumSecurityPolicyForRecord = () => {
        return formValues.rek_security_policy;
    };

    const handlePolicyChange = value => {
        handleDataStreamChange({
            dsi_security_inherited: 0,
            dsi_security_policy: value,
        });
    };

    const handleEmbargoDateClear = () => {
        dataStream.dsi_embargo_date = null;
        handleDataStreamChange({
            dsi_embargo_date: dataStream.dsi_embargo_date,
            dsi_security_inherited: 0,
            dsi_security_policy: minimumSecurityPolicyForRecord(),
        });

        markEmbargoDateAsCleared(true);
    };

    return (
        <React.Fragment key={dataStream.dsi_dsid}>
            {index > 0 ? (
                <Grid item xs={12} style={{ opacity: 0.3 }}>
                    <hr />
                </Grid>
            ) : (
                <div style={{ height: 16, width: '100%' }} />
            )}
            <Grid item xs={12} sm={6} className={classes.dataStreamFileName}>
                <Link title={dataStream.dsi_dsid}>{dataStream.dsi_dsid}</Link>
                <Typography variant="caption">
                    {dataStream.dsi_security_inherited ? 'Inherited' : 'Overridden'}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <PolicyDropdown
                    fieldName={dataStream.dsi_dsid}
                    fieldLabel={policyDropdownLabel}
                    disabled={disabled}
                    {...{
                        input: {
                            onChange: handlePolicyChange,
                            onBlur: /* istanbul ignore next */ () => {},
                        },
                        value: dataStream.dsi_security_inherited ? inheritedSecurity : dataStream.dsi_security_policy,
                    }}
                />
                {!!dataStream.dsi_embargo_date && moment(dataStream.dsi_embargo_date).isSameOrAfter(moment()) && (
                    <React.Fragment>
                        <Grid
                            container
                            spacing={16}
                            alignContent={'center'}
                            alignItems={'flex-end'}
                            justify={'flex-start'}
                            style={{ marginTop: 8 }}
                        >
                            <Grid item xs>
                                <TextField
                                    id="embargo-date"
                                    label="Embargo Date"
                                    value={dataStream.dsi_embargo_date}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Tooltip title={clearDateHint}>
                                    <IconButton
                                        style={{ marginLeft: -24, marginRight: -16, marginBottom: -16 }}
                                        size={'small'}
                                        id="clearEmbargoButton"
                                        onClick={handleEmbargoDateClear}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
                {!!hasClearedEmbargoDate && (
                    <Grid
                        container
                        spacing={8}
                        alignContent={'flex-start'}
                        alignItems={'flex-start'}
                        justify={'flex-start'}
                        style={{ marginTop: 4 }}
                    >
                        <Grid item xs={1}>
                            <WarningIcon fontSize={'small'} style={{ color: theme.palette.warning.main }} />
                        </Grid>
                        <Grid item xs={11}>
                            <Typography style={{ color: theme.palette.warning.main }}>
                                {onEmbargoClearPromptText}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </React.Fragment>
    );
};

DataStreamSecurityItem.propTypes = {
    classes: PropTypes.object,
    clearDateHint: PropTypes.string,
    dataStream: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    index: PropTypes.number,
    initialDataStream: PropTypes.object,
    inheritedSecurity: PropTypes.number,
    onEmbargoClearPromptText: PropTypes.any,
    onSecurityChange: PropTypes.func.isRequired,
    policyDropdownLabel: PropTypes.string,
};

DataStreamSecurityItem.defaultProps = {
    clearDateHint: 'Clear Embargo date and reset Security policy',
    onEmbargoClearPromptText: (
        <span>
            <b>Embargo date removed</b> - review security policy shown above
        </span>
    ),
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disabled === nextProps.disabled &&
        prevProps.dataStream.dsi_security_policy === nextProps.dataStream.dsi_security_policy
    );
}

export default React.memo(DataStreamSecurityItem, isSame);
