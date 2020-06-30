import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

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
            <Grid item xs={12} sm={6} className={classes.dataStreamFileName}>
                <Link title={dataStream.dsi_dsid}>{dataStream.dsi_dsid}</Link>
                <br />
                <Typography variant="caption">
                    {dataStream.dsi_security_inherited ? 'Inherited' : 'Overridden'}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <PolicyDropdown
                    fieldName={dataStream.dsi_dsid}
                    fieldLabel={policyDropdownLabel}
                    inheritedSecurity={inheritedSecurity}
                    disabled={disabled}
                    {...{
                        input: {
                            onChange: handleDataStreamChange,
                            onBlur: /* istanbul ignore next */ () => {},
                        },
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
