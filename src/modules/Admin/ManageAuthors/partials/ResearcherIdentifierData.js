import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form/immutable';

import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NoIcon from '@mui/icons-material/RadioButtonUnchecked';
import YesIcon from '@mui/icons-material/CheckCircle';
import OpenInNew from '@mui/icons-material/OpenInNew';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';
import pageLocale from 'locale/pages';
import { validation } from 'config';
import { FORM_NAME } from './manageAuthorConfig';

const selector = formValueSelector(FORM_NAME);

export const ResearcherIdentifierData = () => {
    const dispatch = useDispatch();
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

    const autIsScopusIdAuthenticated = useSelector(state => selector(state, 'aut_is_scopus_id_authenticated'));
    const autIsOrcidSyncEnabled = useSelector(state => selector(state, 'aut_is_orcid_sync_enabled'));
    const autOrcidId = useSelector(state => selector(state, 'aut_orcid_id'));
    const autScopusId = useSelector(state => selector(state, 'aut_scopus_id'));
    const autGoogleScholarId = useSelector(state => selector(state, 'aut_google_scholar_id'));

    const handleIsScopusIDAuthenticated = () => {
        dispatch(change(FORM_NAME, 'aut_is_scopus_id_authenticated', Number(!autIsScopusIdAuthenticated)));
    };

    const handleIsOrcidSyncEnabled = () => {
        dispatch(change(FORM_NAME, 'aut_is_orcid_sync_enabled', Number(!autIsOrcidSyncEnabled)));
    };

    return (
        <StandardCard subCard title="Researcher identifiers" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    component={AuthorFieldData}
                    authorFieldDataId="aut-researcher-id"
                    name="aut_researcher_id"
                    validate={[validation.isValidResearcherId]}
                    {...researcherId}
                />
                <Field
                    component={AuthorFieldData}
                    authorFieldDataId="aut-scopus-id"
                    name="aut_scopus_id"
                    validate={[validation.maxLength255]}
                    {...scopusId}
                    InputProps={{
                        ...((!!autScopusId && {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={isScopusIdAuthenticated.label}>
                                        <span>
                                            <IconButton
                                                aria-label={isScopusIdAuthenticated.label}
                                                onClick={handleIsScopusIDAuthenticated}
                                                id="aut-is-scopus-id-authenticated"
                                                data-analyticsid="aut-is-scopus-id-authenticated"
                                                data-testid="aut-is-scopus-id-authenticated"
                                                size="large"
                                            >
                                                {autIsScopusIdAuthenticated ? (
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
                <Field
                    component={AuthorFieldData}
                    authorFieldDataId="aut-google-scholar-id"
                    name="aut_google_scholar_id"
                    {...(!!autGoogleScholarId ? { validate: [validation.isValidGoogleScholarId] } : {})}
                    {...googleScholarId}
                />
                <Field
                    component={AuthorFieldData}
                    authorFieldDataId="aut-people-australia-id"
                    name="aut_people_australia_id"
                    validate={[validation.maxLength255]}
                    {...peopleAustraliaId}
                />
                <Field
                    component={AuthorFieldData}
                    authorFieldDataId="aut-orcid-id"
                    name="aut_orcid_id"
                    {...orcidId}
                    InputProps={{
                        readOnly: true,
                        ...(!!autOrcidId
                            ? {
                                  startAdornment: (
                                      <InputAdornment position="start">
                                          <Tooltip title={openOrcidProfileInNewWindow.label}>
                                              <IconButton
                                                  aria-label={openOrcidProfileInNewWindow.label}
                                                  color="secondary"
                                                  href={`${txt.orcidUrlPrefix}${autOrcidId}`}
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
                                                      data-analyticsid="aut-is-orcid-sync-enabled"
                                                      data-testid="aut-is-orcid-sync-enabled"
                                                      size="large"
                                                  >
                                                      {autIsOrcidSyncEnabled ? (
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

export default React.memo(ResearcherIdentifierData);
