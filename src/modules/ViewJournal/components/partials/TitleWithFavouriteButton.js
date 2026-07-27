import React from 'react';
import PropTypes from 'prop-types';

import { useIsMobileView } from 'hooks';
import Grid from '@mui/material/GridLegacy';

import AdminActions from './AdminActions';

const TitleWithFavouriteButton = props => {
    const { journal, showAdminActions = false } = props;
    const isMobileView = useIsMobileView();

    return (
        <Grid container padding={0} spacing={0}>
            <Grid item xs={showAdminActions ? 10 : 12} sm={showAdminActions ? 11 : 12}>
                {journal.jnl_title}
            </Grid>
            {!!showAdminActions && (
                <Grid item xs={2} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <AdminActions
                        journal={journal}
                        navigatedFrom={
                            (location.hash && location.hash.replace('#', '')) ||
                            `${location.pathname}${location.search}`
                        }
                        sx={{ marginLeft: 'auto' }}
                        size={!isMobileView ? 'large' : 'small'}
                    />
                </Grid>
            )}
        </Grid>
    );
};

TitleWithFavouriteButton.propTypes = {
    journal: PropTypes.object.isRequired,
    showAdminActions: PropTypes.bool,
};

export default TitleWithFavouriteButton;
