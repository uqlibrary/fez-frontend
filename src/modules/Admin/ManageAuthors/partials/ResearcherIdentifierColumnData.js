import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import VerifiedScopusUserIcon from '@material-ui/icons/VerifiedUser';
import NonVerifiedScopusUserIcon from '@material-ui/icons/VerifiedUserOutlined';
import OrcidSyncEnabled from '@material-ui/icons/Sync';
import OrcidSyncDisabled from '@material-ui/icons/SyncDisabled';

import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';
import { useEditableContext } from 'context';

export const ResearcherIdentifierColumnData = ({ rowData, ...props }) => {
    const {
        header: {
            columns: {
                scopusId,
                googleScholarId,
                peopleAustraliaId,
                orcidId,
                isScopusIdAuthenticated,
                isOrcidSyncEnabled,
                researcherId,
            },
        },
    } = locale.components.manageAuthors;

    const { editable } = useEditableContext();

    const handleIsScopusIDAuthenticated = () => {
        props.onChange('aut_is_scopus_id_authenticated', !rowData.aut_is_scopus_id_authenticated ? 1 : 0);
    };

    const handleIsOrcidSyncEnabled = () => {
        props.onChange('aut_is_orcid_sync_enabled', !rowData.aut_is_orcid_sync_enabled ? 1 : 0);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-researcher-id-${rowData.tableData.id}`}
                    data={rowData.aut_researcher_id}
                    name="aut_researcher_id"
                    title={researcherId.title}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-scopus-id-${rowData.tableData.id}`}
                    data={rowData.aut_scopus_id}
                    name="aut_scopus_id"
                    title={scopusId.title}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={isScopusIdAuthenticated.title}
                                    tooltip={isScopusIdAuthenticated.title}
                                    onClick={handleIsScopusIDAuthenticated}
                                    {...(editable ? { disabled: false } : { disabled: true })}
                                >
                                    {rowData.aut_is_scopus_id_authenticated ? (
                                        <VerifiedScopusUserIcon tooltip={isScopusIdAuthenticated.title} />
                                    ) : (
                                        <NonVerifiedScopusUserIcon tooltip={isScopusIdAuthenticated.title} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={isOrcidSyncEnabled.title}
                                    tooltip={isOrcidSyncEnabled.title}
                                    onClick={handleIsOrcidSyncEnabled}
                                    {...(editable ? { disabled: false } : { disabled: true })}
                                >
                                    {rowData.aut_is_orcid_sync_enabled ? (
                                        <OrcidSyncEnabled tooltip={isOrcidSyncEnabled.title} />
                                    ) : (
                                        <OrcidSyncDisabled tooltip={isOrcidSyncEnabled.title} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    {...props}
                />
            </Grid>
        </Grid>
    );
};

ResearcherIdentifierColumnData.propTypes = {
    rowData: PropTypes.object,
    onChange: PropTypes.func,
};

export default React.memo(ResearcherIdentifierColumnData);
