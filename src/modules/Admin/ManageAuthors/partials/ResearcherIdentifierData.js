import { useFormContext } from 'react-hook-form';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

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

export const ResearcherIdentifierData = () => {
    const { control, watch, setValue } = useFormContext();
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

    const [autScopusId, autOrcidId, autIsScopusIdAuthenticated, autIsOrcidSyncEnabled] = watch([
        'aut_scopus_id',
        'aut_orcid_id',
        'aut_is_scopus_id_authenticated',
        'aut_is_orcid_sync_enabled',
    ]);

    const handleIsScopusIDAuthenticated = () => {
        setValue('aut_is_scopus_id_authenticated', Number(!autIsScopusIdAuthenticated), { shouldDirty: true });
    };

    const handleIsOrcidSyncEnabled = () => {
        setValue('aut_is_orcid_sync_enabled', Number(!autIsOrcidSyncEnabled), { shouldDirty: true });
    };

    return (
        <StandardCard subCard title="Researcher identifiers" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-researcher-id"
                    name="aut_researcher_id"
                    validate={[validation.isValidResearcherId]}
                    {...researcherId}
                />
                <Field
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-scopus-id"
                    name="aut_scopus_id"
                    validate={[validation.spacelessMaxLength255Validator]}
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
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-google-scholar-id"
                    name="aut_google_scholar_id"
                    validate={[validation.isValidGoogleScholarId]}
                    {...googleScholarId}
                />
                <Field
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-people-australia-id"
                    name="aut_people_australia_id"
                    validate={[validation.spacelessMaxLength255Validator]}
                    {...peopleAustraliaId}
                />
                <Field
                    control={control}
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
ResearcherIdentifierData.propTypes = {
    control: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
};

export default React.memo(ResearcherIdentifierData);
