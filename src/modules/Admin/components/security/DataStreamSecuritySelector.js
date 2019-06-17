import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';

import { PolicyDropdown } from './PolicyDropdown';

export const styles = () => ({
    dataStreamFileBlock: {
        padding: 8,
        marginTop: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    dataStreamFileName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

export const DataStreamSecuritySelector = ({
    text,
    disabled,
    classes,
    meta: {
        initial: dataStreams
    },
    ...props
}) => {
    const [dataStreamSecurity, setDataStreamSecurity] = useState([]);
    useEffect(() => {
        const initialDataStreamSecurity = dataStreams.toJS();
        setDataStreamSecurity(initialDataStreamSecurity);
    }, []); // [] to run this effect only when component is mounted

    const onSecurityChange = (index) => (value) => {
        const newDataStreamSecurity = [
            ...dataStreamSecurity.slice(0, index),
            {
                ...dataStreamSecurity[index],
                dsi_security_policy: value,
                dsi_security_inherited: 0
            },
            ...dataStreamSecurity.slice(index + 1)
        ];
        setDataStreamSecurity(newDataStreamSecurity);
        props.input.onChange(newDataStreamSecurity);
    };

    return (
        <React.Fragment>
            <Typography variant="h6" style={{ marginTop: -8 }}>
                {text.overridePrompt}
            </Typography>
            <Grid
                container
                spacing={16}
                alignContent="flex-end"
                alignItems="flex-end"
                className={classes.dataStreamFileBlock}
            >
                {
                    dataStreamSecurity.map((dataStream, index) => (
                        <React.Fragment key={dataStream.dsi_dsid}>
                            <Grid item xs={12} sm={6} className={classes.dataStreamFileName}>
                                <Link title={dataStream.dsi_dsid}>
                                    {dataStream.dsi_dsid}
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <PolicyDropdown
                                    fieldName={dataStream.dsi_dsid}
                                    fieldLabel={text.overridePolicyPrompt}
                                    disabled={disabled}
                                    {...{
                                        input: {
                                            onChange: onSecurityChange(index),
                                            onBlur: /* istanbul ignore next */ () => { }
                                        },
                                        value: dataStream.dsi_security_policy
                                    }}
                                    onChange={onSecurityChange(dataStream.dsi_dsid)}
                                />
                            </Grid>
                        </React.Fragment>
                    ))
                }
            </Grid>
        </React.Fragment>
    );
};

DataStreamSecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    text: PropTypes.object,
    classes: PropTypes.object,
    input: PropTypes.object,
    meta: PropTypes.shape({
        initial: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired
    }).isRequired
};

function isSame() {
    return true;
}
export default React.memo(withStyles(styles)(DataStreamSecuritySelector), isSame);
