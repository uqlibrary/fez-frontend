import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { has100pcAffiliations, calculateAffiliationPercentile, PRECISION } from 'helpers/authorAffiliations';

const ViewAuthorAffiliations = ({ rowData, locale, onChange }) => {
    const affiliations = rowData.affiliations ?? [];
    const alertOptions = { title: '', message: '' };

    const hasPercentileError = !has100pcAffiliations({ author: rowData });
    const hasProblems = hasPercentileError;

    const {
        organisationalUnits: organisationalUnitsTitle,
        organisationalUnitMissing: organisationalUnitMissingTitle,
        noAffiliationsAdded: noAffiliationsAddedTitle,
        getChipLabel,
        alert: {
            title: alertTitle,
            percentile: { message: alertPercentileMessage, actionButtonLabel: alertPercentileButtonLabel },
            authorOrphan: { message: alertAuthorOrphanMessage },
        },
    } = locale;

    if (hasPercentileError) {
        alertOptions.title = alertTitle;
        if (affiliations.length > 0) {
            alertOptions.message = alertPercentileMessage;
            alertOptions.action = () => {
                const affiliations = calculateAffiliationPercentile(rowData.affiliations);
                const newRowData = { ...rowData, affiliations };
                onChange(newRowData);
            };
            alertOptions.actionButtonLabel = alertPercentileButtonLabel;
        } else {
            alertOptions.message = alertAuthorOrphanMessage;
        }
    }

    return (
        <Grid container spacing={2} size={12}>
            <Grid sx={{ borderBlockEnd: '1px solid rgba(0,0,0,0.12)' }} size={12}>
                <Typography variant="caption">{organisationalUnitsTitle}</Typography>
            </Grid>
            {affiliations.map(item => (
                <React.Fragment key={`${item.af_author_id}-${item.af_id}`}>
                    <Grid size={2}>
                        <Chip
                            id={`orgChip-${item.af_org_id}`}
                            data-testid={`orgChip-${item.af_org_id}`}
                            label={getChipLabel(item.af_percent_affiliation, PRECISION)}
                            variant="outlined"
                            size={'small'}
                            color={hasProblems ? 'error' : 'primary'}
                        />
                    </Grid>
                    <Grid size={10}>
                        <Typography variant="body2" color={hasProblems ? 'error' : 'primary'}>
                            {item.fez_org_structure?.org_title ?? organisationalUnitMissingTitle}
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
            {affiliations.length === 0 && (
                <>
                    <Grid size={2}>
                        <Chip
                            id={'orgChip-error'}
                            data-testid={'orgChip-error'}
                            label={'0%'}
                            variant="outlined"
                            size={'small'}
                            color={'error'}
                        />
                    </Grid>
                    <Grid size={10}>
                        <Typography variant="body2" color={'error'}>
                            {noAffiliationsAddedTitle}
                        </Typography>
                    </Grid>
                </>
            )}
            {hasProblems && (
                <Grid size={12}>
                    <Alert type={'warning'} {...alertOptions} />
                </Grid>
            )}
        </Grid>
    );
};

ViewAuthorAffiliations.propTypes = {
    rowData: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

export default React.memo(ViewAuthorAffiliations);
