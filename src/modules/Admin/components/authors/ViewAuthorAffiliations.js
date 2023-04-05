import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { has100pcAffiliations, calculateAffiliationPercentile, PRECISION } from 'helpers/authorAffiliations';

const ViewAuthorAffiliations = ({ rowData, onChange }) => {
    const affiliations = rowData.affiliations ?? [];
    const alertOptions = { title: '', message: '' };

    const hasPercentileError = !has100pcAffiliations({ author: rowData });
    const hasProblems = hasPercentileError;

    if (hasPercentileError) {
        alertOptions.title = 'Author affiliation information is incomplete';
        if (affiliations.length > 0) {
            alertOptions.message = 'Percentage sum total of all affiliations must equal 100%';
            alertOptions.action = () => {
                const affiliations = calculateAffiliationPercentile(rowData.affiliations);
                const newRowData = { ...rowData, affiliations };
                onChange(newRowData);
            };
            alertOptions.actionButtonLabel = 'Recalculate Percentages';
        } else {
            alertOptions.message = 'Author requires at least one affiliation to be added';
        }
    }

    return (
        <Grid container xs={12} spacing={2}>
            <Grid xs={12} sx={{ borderBlockEnd: '1px solid rgba(0,0,0,0.12)' }}>
                <Typography variant="caption">Organisational Unit</Typography>
            </Grid>
            {affiliations.map(item => (
                <React.Fragment key={`${item.af_author_id}-${item.af_id}`}>
                    <Grid xs={2}>
                        <Chip
                            label={`${Number(item.af_percent_affiliation / PRECISION)}%`}
                            variant="outlined"
                            size={'small'}
                            color={hasProblems ? 'error' : 'primary'}
                        />
                    </Grid>
                    <Grid xs={10}>
                        <Typography variant="body2" color={hasProblems ? 'error' : 'primary'}>
                            {item.fez_org_structure?.org_title ?? 'Organisational Unit data missing'}
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
            {affiliations.length === 0 && (
                <>
                    <Grid xs={2}>
                        <Chip label={'0%'} variant="outlined" size={'small'} color={'error'} />
                    </Grid>
                    <Grid xs={10}>
                        <Typography variant="body2" color={'error'}>
                            No affiliations have been added
                        </Typography>
                    </Grid>
                </>
            )}
            {hasProblems && (
                <Grid xs={12}>
                    <Alert type={'warning'} {...alertOptions} />
                </Grid>
            )}
        </Grid>
    );
};

ViewAuthorAffiliations.propTypes = {
    rowData: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

export default React.memo(ViewAuthorAffiliations);
