import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import NoIcon from '@material-ui/icons/RadioButtonUnchecked';
import YesIcon from '@material-ui/icons/CheckCircle';
import OpenInNew from '@material-ui/icons/OpenInNew';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';
import pageLocale from 'locale/pages';

export const ResearcherIdentifierData = ({ rowData, ...props }) => {
    const {
        editRow: {
            fields: {
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

    const txt = pageLocale.pages.dashboard.header.dashboardResearcherIds;
    const handleIsScopusIDAuthenticated = () => {
        props.onChange('aut_is_scopus_id_authenticated', Number(!rowData.aut_is_scopus_id_authenticated));
    };

    const handleIsOrcidSyncEnabled = () => {
        props.onChange('aut_is_orcid_sync_enabled', Number(!rowData.aut_is_orcid_sync_enabled));
    };

    return (
        <StandardCard subCard title="Researcher identifiers" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <AuthorFieldData
                    authorFieldDataId="aut-researcher-id"
                    data={rowData.aut_researcher_id}
                    name="aut_researcher_id"
                    {...researcherId}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-scopus-id"
                    data={rowData.aut_scopus_id}
                    name="aut_scopus_id"
                    {...scopusId}
                    {...props}
                    InputProps={{
                        ...((!!rowData.aut_scopus_id && {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={isScopusIdAuthenticated.label}>
                                        <span>
                                            <IconButton
                                                aria-label={isScopusIdAuthenticated.label}
                                                onClick={handleIsScopusIDAuthenticated}
                                                id="aut-is-scopus-id-authenticated"
                                                data-testid="aut-is-scopus-id-authenticated"
                                            >
                                                {rowData.aut_is_scopus_id_authenticated ? (
                                                    <YesIcon
                                                        id="scopus-id-is-authenticated"
                                                        data-testid="scopus-id-is-authenticated"
                                                        color="primary"
                                                    />
                                                ) : (
                                                    <NoIcon
                                                        id="scopus-id-is-not-authenticated"
                                                        data-testid="scopus-id-is-not-authenticated"
                                                        color="secondary"
                                                    />
                                                )}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }) ||
                            {}),
                    }}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-google-scholar-id"
                    data={rowData.aut_google_scholar_id}
                    name="aut_google_scholar_id"
                    {...googleScholarId}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-people-australia-id"
                    data={rowData.aut_people_australia_id}
                    name="aut_people_australia_id"
                    {...peopleAustraliaId}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-orcid-id"
                    data={rowData.aut_orcid_id}
                    name="aut_orcid_id"
                    {...orcidId}
                    {...props}
                    InputProps={{
                        ...(!!rowData.aut_orcid_id
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
                                  endAdornment: (
                                      <InputAdornment position="end">
                                          <Tooltip title={isOrcidSyncEnabled.label}>
                                              <span>
                                                  <IconButton
                                                      aria-label={isOrcidSyncEnabled.label}
                                                      onClick={handleIsOrcidSyncEnabled}
                                                      id="aut-is-orcid-sync-enabled"
                                                      data-testid="aut-is-orcid-sync-enabled"
                                                  >
                                                      {rowData.aut_is_orcid_sync_enabled ? (
                                                          <YesIcon
                                                              id="orcid-sync-is-enabled"
                                                              data-testid="orcid-sync-is-enabled"
                                                              color="primary"
                                                          />
                                                      ) : (
                                                          <NoIcon
                                                              id="orcid-sync-is-not-enabled"
                                                              data-testid="orcid-sync-is-not-enabled"
                                                              color="secondary"
                                                          />
                                                      )}
                                                  </IconButton>
                                              </span>
                                          </Tooltip>
                                      </InputAdornment>
                                  ),
                              }
                            : {}),
                    }}
                />
            </Grid>
        </StandardCard>
    );
};

ResearcherIdentifierData.propTypes = {
    rowData: PropTypes.object,
    onChange: PropTypes.func,
};

export default React.memo(ResearcherIdentifierData);
