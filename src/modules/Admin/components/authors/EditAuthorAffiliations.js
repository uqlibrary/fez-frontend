import React, { useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import {
    PRECISION,
    ACTIONS,
    hasAffiliationProblems,
    isNonHerdc,
    hasNonHerdc,
    calculateAffiliationPercentile,
    deepClone,
    editAffiliationReducer,
    createNewAffiliationObject,
} from 'helpers/authorAffiliations';

const actionHandler = {
    [ACTIONS.CHANGE]: (dispatch, currentAffiliation, organisation) => {
        const newAffiliation = deepClone(currentAffiliation);
        newAffiliation.af_org_id = organisation.org_id;
        newAffiliation.fez_org_structure = { ...organisation };
        dispatch({
            type: ACTIONS.CHANGE,
            affiliation: newAffiliation,
        });
    },
    [ACTIONS.DELETE]: (dispatch, index) => {
        dispatch({
            type: ACTIONS.DELETE,
            index,
        });
    },
    [ACTIONS.ADD]: (dispatch, rowData, organisation) => {
        const newAffiliation = createNewAffiliationObject(rowData, organisation);
        dispatch({
            type: ACTIONS.ADD,
            affiliation: newAffiliation,
        });
    },
    [ACTIONS.NONHERDC]: (dispatch, rowData, organisation, suggestedOrganisation) => {
        const nonHerdcAffiliation = createNewAffiliationObject(rowData, organisation);
        const suggestedAffiliation = createNewAffiliationObject(
            rowData,
            suggestedOrganisation,
            nonHerdcAffiliation.af_id + 100, // ensure the af_id value is different to the previous call
        );
        dispatch({
            type: ACTIONS.NONHERDC,
            nonHerdcAffiliation,
            suggestedAffiliation,
        });
    },
};

const EditAuthorAffiliations = ({
    rowData,
    locale,
    setEditing,
    onChange,
    organisationalUnitList,
    loadOrganisationalUnitsList,
    suggestedOrganisationalUnitList, // from redux
    loadSuggestedOrganisationalUnitsList,
}) => {
    const uniqueOrgs = useRef([]);
    const theme = useTheme();

    const {
        suggestedAuthorId,
        suggestedOrganisationUnits,
        suggestedOrganisationUnitsLoaded,
        suggestedOrganisationUnitsLoading,
        suggestedOrganisationUnitsFailed,
    } = suggestedOrganisationalUnitList;

    const {
        organisationUnits,
        organisationUnitsLoaded,
        organisationUnitsLoading,
        organisationUnitsFailed,
    } = organisationalUnitList;

    React.useEffect(() => {
        if (
            organisationUnitsLoaded === false &&
            organisationUnitsLoading === false &&
            organisationUnitsFailed === false
        ) {
            // dispatch
            loadOrganisationalUnitsList();
            loadSuggestedOrganisationalUnitsList(rowData.aut_id);
        } else if (
            organisationUnitsLoaded &&
            (rowData.aut_id !== suggestedAuthorId || suggestedOrganisationUnitsLoaded === false) &&
            suggestedOrganisationUnitsLoading === false &&
            suggestedOrganisationUnitsFailed === false
        ) {
            // dispatch
            loadSuggestedOrganisationalUnitsList(rowData.aut_id);
        }
    }, [
        loadOrganisationalUnitsList,
        loadSuggestedOrganisationalUnitsList,
        organisationUnitsFailed,
        organisationUnitsLoaded,
        organisationUnitsLoading,
        rowData.aut_id,
        suggestedAuthorId,
        suggestedOrganisationUnitsFailed,
        suggestedOrganisationUnitsLoaded,
        suggestedOrganisationUnitsLoading,
    ]);

    const recalculatedAffiliations = calculateAffiliationPercentile(rowData.affiliations);
    const [currentAffiliations, dispatch] = useReducer(editAffiliationReducer, recalculatedAffiliations);

    if (uniqueOrgs.current.length === 0 && organisationUnitsLoaded && suggestedOrganisationUnitsLoaded) {
        const combinedArr = suggestedOrganisationUnits.concat(organisationUnits);
        const uniqueIds = Array.from(new Set(combinedArr.map(item => item.org_id)));
        uniqueOrgs.current = uniqueIds.map(id => combinedArr.find(obj => obj.org_id === id));
    }

    const currentAffiliationOrgIds = currentAffiliations.map(item => item.af_org_id) ?? [];

    const {
        organisationalUnits: organisationalUnitsTitle,
        affiliationPctTitle: affiliationTitle,
        loadingOrganisationalUnits: loadingOrganisationalUnitsText,
        organisationMissing: organisationMissingLabel,
        getChipLabel,
        getSuggestedTitle,
        organisationPlaceholder: organisationPlaceholderText,
        cancelButton: cancelButtonLabel,
        saveButton: saveButtonLabel,
    } = locale;

    return (
        <Grid container xs={12} alignItems={'center'} spacing={2}>
            <Grid xs={7} sx={{ borderBlockEnd: '1px solid rgba(0,0,0,0.12)' }}>
                <Typography variant="caption">{organisationalUnitsTitle}</Typography>
            </Grid>
            <Grid xs={5} sx={{ borderBlockEnd: '1px solid rgba(0,0,0,0.12)' }}>
                <Typography variant="caption">{affiliationTitle}</Typography>
            </Grid>

            {(organisationUnitsLoading || suggestedOrganisationUnitsLoading) &&
                !organisationUnitsFailed &&
                !suggestedOrganisationUnitsFailed && <ContentLoader message={loadingOrganisationalUnitsText} />}
            {!organisationUnitsLoading &&
                !suggestedOrganisationUnitsLoading &&
                organisationUnitsLoaded &&
                suggestedOrganisationUnitsLoaded && (
                    <React.Fragment>
                        {currentAffiliations.map((item, index) => (
                            <React.Fragment key={`${item.af_author_id}-${item.af_id}`}>
                                <Grid xs={7} padding={1}>
                                    <Autocomplete
                                        clearOnBlur
                                        disableClearable
                                        value={
                                            uniqueOrgs.current?.find(org => org.org_id === item.af_org_id) ?? {
                                                org_title: organisationMissingLabel,
                                            }
                                        }
                                        options={uniqueOrgs.current ?? []}
                                        getOptionLabel={option => option.org_title}
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li"
                                                sx={{
                                                    ...(!!option.suggested
                                                        ? { color: theme.palette.primary.main }
                                                        : {}),
                                                }}
                                                {...props}
                                                key={option.org_id}
                                            >
                                                {!!option.suggested
                                                    ? getSuggestedTitle(option.org_title)
                                                    : option.org_title}
                                            </Box>
                                        )}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                size={'small'}
                                                variant={'standard'}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: organisationPlaceholderText,
                                                }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    error: !!!uniqueOrgs.current?.find(
                                                        org => org.org_id === item.af_org_id,
                                                    ),
                                                }}
                                            />
                                        )}
                                        onChange={(_, newValue) => {
                                            if (isNonHerdc(newValue)) {
                                                actionHandler[ACTIONS.NONHERDC](
                                                    dispatch,
                                                    rowData,
                                                    newValue,
                                                    uniqueOrgs.current[suggestedOrganisationUnits.length > 0 ? 0 : 1],
                                                );
                                            } else {
                                                actionHandler[ACTIONS.CHANGE](dispatch, item, newValue);
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid xs={4} padding={1}>
                                    <Chip
                                        label={getChipLabel(item.af_percent_affiliation, PRECISION)}
                                        variant="outlined"
                                        size={'small'}
                                        color={
                                            !!uniqueOrgs.current?.find(org => org.org_id === item.af_org_id)
                                                ? 'primary'
                                                : 'error'
                                        }
                                    />
                                </Grid>

                                <Grid xs={1} justifyContent={'flex-end'} padding={1}>
                                    {(hasNonHerdc(currentAffiliations) === false || isNonHerdc(item)) && (
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => actionHandler[ACTIONS.DELETE](dispatch, index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </React.Fragment>
                        ))}
                        {!hasNonHerdc(currentAffiliations) && (
                            <Grid xs={7} padding={1}>
                                <Autocomplete
                                    key={Date.now()}
                                    clearOnBlur
                                    disableClearable
                                    options={
                                        uniqueOrgs.current?.filter(
                                            org => !currentAffiliationOrgIds.includes(org.org_id),
                                        ) ?? []
                                    }
                                    getOptionLabel={option => option.org_title}
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            sx={{
                                                ...(!!option.suggested ? { color: theme.palette.primary.main } : {}),
                                            }}
                                            {...props}
                                            key={option.org_id}
                                        >
                                            {!!option.suggested
                                                ? getSuggestedTitle(option.org_title)
                                                : option.org_title}
                                        </Box>
                                    )}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            size={'small'}
                                            variant={'standard'}
                                            placeholder={organisationPlaceholderText}
                                        />
                                    )}
                                    onChange={(event, newValue) => {
                                        if (isNonHerdc(newValue)) {
                                            actionHandler[ACTIONS.NONHERDC](
                                                dispatch,
                                                rowData,
                                                newValue,
                                                uniqueOrgs.current[suggestedOrganisationUnits.length > 0 ? 0 : 1],
                                            );
                                        } else actionHandler[ACTIONS.ADD](dispatch, rowData, newValue);
                                    }}
                                />
                            </Grid>
                        )}
                    </React.Fragment>
                )}
            <Grid container xs={12} justifyContent={'flex-end'}>
                <Button
                    id="affiliationCancelBtn"
                    data-testid="affiliationCancelBtn"
                    onClick={() => setEditing({ editing: false, aut_id: rowData.aut_id })}
                >
                    {cancelButtonLabel}
                </Button>
                <Button
                    id="affiliationSaveBtn"
                    data-testid="affiliationSaveBtn"
                    onClick={() => {
                        const newRowData = { ...rowData, affiliations: [...currentAffiliations] };
                        onChange(newRowData);
                        setEditing({ editing: false, aut_id: rowData.aut_id });
                    }}
                    disabled={hasAffiliationProblems(currentAffiliations)}
                >
                    {saveButtonLabel}
                </Button>
            </Grid>
        </Grid>
    );
};

EditAuthorAffiliations.propTypes = {
    rowData: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    setEditing: PropTypes.func,
    onChange: PropTypes.func,
    organisationalUnitList: PropTypes.object,
    suggestedOrganisationalUnitList: PropTypes.object,
    loadSuggestedOrganisationalUnitsList: PropTypes.func,
    loadOrganisationalUnitsList: PropTypes.func,
    clearSuggestedOrganisationalUnits: PropTypes.func,
};

export default React.memo(EditAuthorAffiliations);
