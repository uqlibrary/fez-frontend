import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import PolicyDescription from './PolicyDescription';

export const InheritedSecurityDetails = ({ title, collections, parentKey }) => (
    <Grid
        style={{
            padding: 24,
            backgroundColor: 'rgba(0,0,0,0.05)',
        }}
        size={12}
    >
        <Typography variant="h6" style={{ marginTop: -8 }}>
            {title}
        </Typography>
        <Grid container spacing={1} style={{ marginTop: 8 }}>
            {collections?.map(item => (
                <React.Fragment key={item.rek_ismemberof}>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 2
                        }}>
                        <Typography variant="subtitle1">{`${item.rek_ismemberof}`}</Typography>
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 7
                        }}>
                        <Typography variant="subtitle2">{`${item.rek_ismemberof_lookup}`}</Typography>
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 3
                        }}>
                        <Typography variant="body2">
                            <PolicyDescription selectedPolicyKey={(item.parent || {})[parentKey]} />
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    </Grid>
);

InheritedSecurityDetails.propTypes = {
    title: PropTypes.string.isRequired,
    collections: PropTypes.array.isRequired,
    parentKey: PropTypes.string.isRequired,
};

export default React.memo(InheritedSecurityDetails);
