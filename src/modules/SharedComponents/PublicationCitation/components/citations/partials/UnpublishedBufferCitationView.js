import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CitationView from './CitationView';
import DateCitationView from './DateCitationView';

import { GENERIC_DATE_FORMAT } from 'config/general';

export const UnpublishedBufferCitationView = ({ publication }) => {
    return (
        <Grid container alignItems="center">
            <Grid item xs="auto" style={{ flexGrow: 1 }}>
                <Typography variant="caption">
                    <i>
                        <CitationView suffix=", " value={publication.rek_status_lookup} />
                    </i>
                    <DateCitationView
                        isLocalised
                        format={GENERIC_DATE_FORMAT}
                        prefix="Created "
                        suffix=", "
                        date={publication.rek_created_date}
                        forceSpecifiedFormat
                    />
                    <DateCitationView
                        isLocalised
                        format={GENERIC_DATE_FORMAT}
                        prefix="Updated "
                        suffix="."
                        date={publication.rek_updated_date}
                        forceSpecifiedFormat
                    />
                </Typography>
            </Grid>
        </Grid>
    );
};

UnpublishedBufferCitationView.propTypes = {
    publication: PropTypes.object,
};

export default React.memo(UnpublishedBufferCitationView);
