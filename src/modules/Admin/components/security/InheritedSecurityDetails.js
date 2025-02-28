import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import PolicyDescription from './PolicyDescription';

export const InheritedSecurityDetails = ({ title, collections, parentKey }) => {
    // console.log('collections.map=', collections.map);
    return (
        <Grid
            xs={12}
            style={{
                padding: 24,
                backgroundColor: 'rgba(0,0,0,0.05)',
            }}
        >
            <Typography variant="h6" style={{ marginTop: -8 }}>
                {title}
            </Typography>
            <Grid container spacing={1} style={{ marginTop: 8 }}>
                {collections?.map(item => (
                    <React.Fragment key={item.rek_ismemberof}>
                        <Grid xs={12} sm={2}>
                            <Typography variant="subtitle1">{`${item.rek_ismemberof}`}</Typography>
                        </Grid>
                        <Grid xs={12} sm={7}>
                            <Typography variant="subtitle2">{`${item.rek_ismemberof_lookup}`}</Typography>
                        </Grid>
                        <Grid xs={12} sm={3}>
                            <Typography variant="body2">
                                <PolicyDescription selectedPolicyKey={(item.parent || {})[parentKey]} />
                            </Typography>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Grid>
    );
};

InheritedSecurityDetails.propTypes = {
    title: PropTypes.string.isRequired,
    collections: PropTypes.array.isRequired,
    parentKey: PropTypes.string.isRequired,
};

export default React.memo(InheritedSecurityDetails);
