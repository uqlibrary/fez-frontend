import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { PolicyDropdown } from './PolicyDropdown';

const DataStreamSecurityItem = ({
    dataStream,
    classes,
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

    return (
        <React.Fragment key={dataStream.dsi_dsid}>
            <Grid
                sx={{ ...classes.dataStreamFileName }}
                size={{
                    xs: 12,
                    sm: 6
                }}>
                <Link title={dataStream.dsi_dsid} underline="hover">
                    {dataStream.dsi_dsid}
                </Link>
                <br />
                <Typography variant="caption">
                    {dataStream.dsi_security_inherited ? 'Inherited' : 'Overridden'}
                </Typography>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}>
                <PolicyDropdown
                    fieldName={dataStream.dsi_dsid}
                    fieldLabel={policyDropdownLabel}
                    inheritedSecurity={inheritedSecurity}
                    disabled={disabled}
                    {...{
                        onChange: handleDataStreamChange,
                        onBlur: /* istanbul ignore next */ () => {},
                        value: dataStream.dsi_security_inherited ? inheritedSecurity : dataStream.dsi_security_policy,
                    }}
                    policyDropdownId={`dsi-security-policy-${index}`}
                />
            </Grid>
        </React.Fragment>
    );
};

DataStreamSecurityItem.propTypes = {
    classes: PropTypes.object,
    dataStream: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    index: PropTypes.number,
    initialDataStream: PropTypes.object,
    inheritedSecurity: PropTypes.number,
    onSecurityChange: PropTypes.func.isRequired,
    policyDropdownLabel: PropTypes.string,
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disabled === nextProps.disabled &&
        prevProps.dataStream.dsi_security_policy === nextProps.dataStream.dsi_security_policy
    );
}

export default React.memo(DataStreamSecurityItem, isSame);
