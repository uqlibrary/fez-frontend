import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import VerifiedScopusUserIcon from '@material-ui/icons/VerifiedUser';
import NonVerifiedScopusUserIcon from '@material-ui/icons/VerifiedUserOutlined';
import OrcidSyncEnabled from '@material-ui/icons/Sync';
import OrcidSyncDisabled from '@material-ui/icons/SyncDisabled';
import OpenInNew from '@material-ui/icons/OpenInNew';

import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';
import { useEditableContext } from 'context';
import pageLocale from 'locale/pages';

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
                openOrcidProfileInNewWindow,
            },
        },
    } = locale.components.manageAuthors;

    const { editable } = useEditableContext();
    const txt = pageLocale.pages.dashboard.header.dashboardResearcherIds;
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
                    authorFieldDataId={`aut-researcher-id${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_researcher_id}
                    name="aut_researcher_id"
                    {...researcherId}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-scopus-id${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_scopus_id}
                    name="aut_scopus_id"
                    {...scopusId}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title={isScopusIdAuthenticated.label}>
                                    <span>
                                        <IconButton
                                            aria-label={isScopusIdAuthenticated.label}
                                            onClick={handleIsScopusIDAuthenticated}
                                            {...(editable ? { disabled: false } : { disabled: true })}
                                        >
                                            {rowData.aut_is_scopus_id_authenticated ? (
                                                <VerifiedScopusUserIcon />
                                            ) : (
                                                <NonVerifiedScopusUserIcon />
                                            )}
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-google-scholar-id${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_google_scholar_id}
                    name="aut_google_scholar_id"
                    {...googleScholarId}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-people-australia-id${
                        !!rowData.tableData ? '-' + rowData.tableData.id : ''
                    }`}
                    data={rowData.aut_people_australia_id}
                    name="aut_people_australia_id"
                    {...peopleAustraliaId}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-orcid-id${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_orcid_id}
                    name="aut_orcid_id"
                    {...orcidId}
                    InputProps={{
                        ...(!editable && !!rowData.aut_orcid_id
                            ? {
                                  startAdornment: (
                                      <InputAdornment position="start">
                                          <Tooltip title={openOrcidProfileInNewWindow.label}>
                                              <IconButton
                                                  aria-label={openOrcidProfileInNewWindow.label}
                                                  color="secondary"
                                                  href={`${txt.orcidUrlPrefix}${rowData.aut_orcid_id}`}
                                                  target="_blank"
                                                  size="small"
                                              >
                                                  <OpenInNew />
                                              </IconButton>
                                          </Tooltip>
                                      </InputAdornment>
                                  ),
                              }
                            : {}),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title={isOrcidSyncEnabled.label}>
                                    <span>
                                        <IconButton
                                            aria-label={isOrcidSyncEnabled.label}
                                            onClick={handleIsOrcidSyncEnabled}
                                            {...(editable ? { disabled: false } : { disabled: true })}
                                        >
                                            {rowData.aut_is_orcid_sync_enabled ? (
                                                <OrcidSyncEnabled />
                                            ) : (
                                                <OrcidSyncDisabled />
                                            )}
                                        </IconButton>
                                    </span>
                                </Tooltip>
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
