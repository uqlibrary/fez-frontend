import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import InlineLoader from './InlineLoader';

export default function ContentLoader({ message }) {
    return (
        <StandardPage>
            <Grid container>
                <Grid item xs={12}>
                    <InlineLoader message={message} />
                </Grid>
            </Grid>
        </StandardPage>
    );
}

ContentLoader.propTypes = {
    message: PropTypes.string,
};
