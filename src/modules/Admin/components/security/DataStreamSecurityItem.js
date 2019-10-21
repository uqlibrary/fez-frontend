import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useFormValuesContext } from 'context';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

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
            value === initialDataStream.dsi_security_policy
                ? initialDataStream
                : {
                    ...dataStream,
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
        // clear the embargo value & reset the associated security
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
                        <div style={{ marginTop: 12 }}>
                            <span>Embargo Date: {dataStream.dsi_embargo_date}</span>
                            <Tooltip title={clearDateHint}>
                                <div style={{ display: 'inline' }}>
                                    <IconButton
                                        style={{ marginTop: -10, marginBottom: -10 }}
                                        className="deleteFieldButton"
                                        onClick={handleEmbargoDateClear}
                                    >
                                        <Close />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </div>
                    </React.Fragment>
                )}
                {!!hasClearedEmbargoDate && (
                    <React.Fragment>
                        <p>{onEmbargoClearPromptText}</p>
                    </React.Fragment>
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
    onEmbargoClearPromptText: PropTypes.string,
    onSecurityChange: PropTypes.func.isRequired,
    policyDropdownLabel: PropTypes.string,
};

DataStreamSecurityItem.defaultProps = {
    clearDateHint: 'Clear Embargo date and reset Security policy',
    onEmbargoClearPromptText: 'Embargo date cleared - consider the correct policy',
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disabled === nextProps.disabled &&
        prevProps.dataStream.dsi_security_policy === nextProps.dataStream.dsi_security_policy
    );
}

export default React.memo(DataStreamSecurityItem, isSame);
