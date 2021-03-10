import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const ResearcherIdentifierColumnData = ({ rowData, ...props }) => {
    const {
        header: {
            columns: { scopusId, googleScholarId, peopleAustraliaId, orcidId },
        },
    } = locale.components.manageAuthors;
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-scopus-id-${rowData.tableData.id}`}
                    data={rowData.aut_scopus_id}
                    name="aut_scopus_id"
                    title={scopusId.title}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-google-scholar-id-${rowData.tableData.id}`}
                    data={rowData.aut_google_scholar_id}
                    name="aut_google_scholar_d"
                    title={googleScholarId.title}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-people-australia-id-${rowData.tableData.id}`}
                    data={rowData.aut_people_australia_id}
                    name="aut_people_australia_id"
                    title={peopleAustraliaId.title}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-orcid-id-${rowData.tableData.id}`}
                    data={rowData.aut_orcid_id}
                    name="aut_orcid_id"
                    title={orcidId.title}
                    {...props}
                />
            </Grid>
        </Grid>
    );
};

ResearcherIdentifierColumnData.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(ResearcherIdentifierColumnData);
