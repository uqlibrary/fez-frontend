import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PolicyDescription from './PolicyDescription';

export const InheritedSecurityDetails = ({collections}) => (
    <Grid item xs={12} style={{
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.05)'
    }}>
        <Typography variant="h6" style={{ marginTop: -8 }}>
            Inherited security policy details
        </Typography>
        <Grid container spacing={8} style={{ marginTop: 8 }}>
            {
                collections.map(item => (
                    <React.Fragment key={item.rek_ismemberof}>
                        <Grid item xs={12} sm={2}>
                            <Typography variant="subtitle1">
                                {`${item.rek_ismemberof}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Typography variant="subtitle2">
                                {
                                    `${item.rek_ismemberof_lookup}`
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="body2">
                                <PolicyDescription selectedPolicyKey={item.parent.rek_security_policy} />
                            </Typography>
                        </Grid>
                    </React.Fragment>
                ))
            }
        </Grid>
    </Grid>
);

InheritedSecurityDetails.propTypes = {
    collections: PropTypes.array.isRequired
};

export default React.memo(InheritedSecurityDetails);
