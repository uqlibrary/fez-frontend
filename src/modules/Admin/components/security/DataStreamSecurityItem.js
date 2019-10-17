import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
    policyDropdownLabel,
}) => {
    const handleDataStreamChange = value => {
        onSecurityChange(
            index,
            value === initialDataStream.dsi_security_policy
                ? initialDataStream
                : {
                    ...dataStream,
                    dsi_security_inherited: 0,
                    dsi_security_policy: value,
                },
        );
    };
    // const _clearEmbargoDate = index => () => onSecurityChange(index, value='', 'dsi_embargo_date', '', );

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
                            onChange: handleDataStreamChange,
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
                                        // onClick={_clearEmbargoDate(index)}
                                    >
                                        <Close />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </div>
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
    onSecurityChange: PropTypes.func.isRequired,
    policyDropdownLabel: PropTypes.string,
};

DataStreamSecurityItem.defaultProps = {
    clearDateHint: 'Clear Embargo date and set Security policy to Public',
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disabled === nextProps.disabled &&
        prevProps.dataStream.dsi_security_policy === nextProps.dataStream.dsi_security_policy
    );
}

export default React.memo(DataStreamSecurityItem, isSame);
