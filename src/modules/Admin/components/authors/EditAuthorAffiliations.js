import React, { useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';

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

import {
    loadOrganisationalUnits,
    loadSuggestedOrganisationalUnitByAuthorId,
    clearSuggestedOrganisationalUnits,
} from 'actions';

export const actionHandler = {
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

const EditAuthorAffiliations = ({ rowData, locale, setEditing, onChange }) => {
    const uniqueOrgs = useRef([]);
    const theme = useTheme();
    const dispatch = useDispatch();

    const { organisationUnits, organisationUnitsLoaded, organisationUnitsLoading, organisationUnitsFailed } =
        useSelector(state => state.get('organisationalUnitsReducer'));
    const {
        suggestedAuthorId,
        suggestedOrganisationUnits,
        suggestedOrganisationUnitsLoaded,
        suggestedOrganisationUnitsLoading,
        suggestedOrganisationUnitsFailed,
    } = useSelector(state => state.get('suggestedOrganisationalUnitsReducer'));

    React.useEffect(() => {
        const loadOrganisationalUnitsList = () => dispatch(loadOrganisationalUnits());
        const loadSuggestedOrganisationalUnitsList = authorId =>
            dispatch(loadSuggestedOrganisationalUnitByAuthorId(authorId));
        const clearSuggestedOrganisationalUnitsList = () => dispatch(clearSuggestedOrganisationalUnits());
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
            clearSuggestedOrganisationalUnitsList();
            loadSuggestedOrganisationalUnitsList(rowData.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
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
    const [currentAffiliations, actionDispatch] = useReducer(editAffiliationReducer, recalculatedAffiliations);

    if (uniqueOrgs.current.length === 0 && organisationUnitsLoaded && suggestedOrganisationUnitsLoaded) {
        const combinedArr = suggestedOrganisationUnits.concat(organisationUnits);
        const uniqueIds = Array.from(new Set(combinedArr.map(item => item.org_id)));
        uniqueOrgs.current = uniqueIds.map(id => combinedArr.find(obj => obj.org_id === id));
    }

    const currentAffiliationOrgIds = currentAffiliations.map(item => item.af_org_id);

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
        <Grid
            container
            spacing={2}
            size={12}
            sx={{
                alignItems: 'center',
            }}
        >
            <Grid sx={{ borderBlockEnd: '1px solid rgba(0,0,0,0.12)' }} size={7}>
                <Typography variant="caption">{organisationalUnitsTitle}</Typography>
            </Grid>
            <Grid sx={{ borderBlockEnd: '1px solid rgba(0,0,0,0.12)' }} size={5}>
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
                                <Grid
                                    size={7}
                                    sx={{
                                        padding: 1,
                                    }}
                                >
                                    <Autocomplete
                                        id={`orgSelect-${item.af_org_id}`}
                                        clearOnBlur
                                        disableClearable
                                        value={
                                            uniqueOrgs.current?.find(
                                                org => org.org_id === item.af_org_id,
                                            ) ?? /* istanbul ignore next */ {
                                                org_title: organisationMissingLabel,
                                            }
                                        }
                                        options={uniqueOrgs.current ?? /* istanbul ignore next */ []}
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
                                                    id: `orgSelect-${item.af_org_id}-input`,
                                                    'data-testid': `orgSelect-${item.af_org_id}-input`,
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
                                                    actionDispatch,
                                                    rowData,
                                                    newValue,
                                                    uniqueOrgs.current[
                                                        suggestedOrganisationUnits.length > 0
                                                            ? 0
                                                            : /* istanbul ignore next */ 1
                                                    ],
                                                );
                                            } else {
                                                actionHandler[ACTIONS.CHANGE](actionDispatch, item, newValue);
                                            }
                                        }}
                                        slotProps={{
                                            listbox: {
                                                id: `orgSelect-${item.af_org_id}-options`,
                                                'data-testid': `orgSelect-${item.af_org_id}-options`,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    size={4}
                                    sx={{
                                        padding: 1,
                                    }}
                                >
                                    <Chip
                                        id={`orgChip-${item.af_org_id}`}
                                        data-testid={`orgChip-${item.af_org_id}`}
                                        label={getChipLabel(item.af_percent_affiliation, PRECISION)}
                                        variant="outlined"
                                        size={'small'}
                                        color="primary"
                                    />
                                </Grid>

                                <Grid
                                    size={1}
                                    sx={{
                                        justifyContent: 'flex-end',
                                        padding: 1,
                                    }}
                                >
                                    {(hasNonHerdc(currentAffiliations) === false || isNonHerdc(item)) && (
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => actionHandler[ACTIONS.DELETE](actionDispatch, index)}
                                            id={`deleteOrgBtn-${item.af_org_id}`}
                                            data-testid={`deleteOrgBtn-${item.af_org_id}`}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </React.Fragment>
                        ))}
                        {!hasNonHerdc(currentAffiliations) && (
                            <Grid
                                size={7}
                                sx={{
                                    padding: 1,
                                }}
                            >
                                <Autocomplete
                                    id={'orgSelect-add'}
                                    data-testid={'orgSelect-add'}
                                    key={Date.now()}
                                    clearOnBlur
                                    disableClearable
                                    options={
                                        uniqueOrgs.current?.filter(
                                            org => !currentAffiliationOrgIds.includes(org.org_id),
                                        ) ?? /* istanbul ignore next */ []
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
                                            inputProps={{
                                                ...params.inputProps,
                                                id: 'orgSelect-add-input',
                                                'data-testid': 'orgSelect-add-input',
                                            }}
                                        />
                                    )}
                                    onChange={(event, newValue) => {
                                        if (isNonHerdc(newValue)) {
                                            actionHandler[ACTIONS.NONHERDC](
                                                actionDispatch,
                                                rowData,
                                                newValue,
                                                uniqueOrgs.current[
                                                    suggestedOrganisationUnits.length > 0
                                                        ? 0
                                                        : /* istanbul ignore next */ 1
                                                ],
                                            );
                                        } else actionHandler[ACTIONS.ADD](actionDispatch, rowData, newValue);
                                    }}
                                    slotProps={{
                                        listbox: {
                                            id: 'orgSelect-add-options',
                                            'data-testid': 'orgSelect-add-options',
                                        },
                                    }}
                                />
                            </Grid>
                        )}
                    </React.Fragment>
                )}
            <Grid
                container
                size={12}
                sx={{
                    justifyContent: 'flex-end',
                }}
            >
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
};

export default React.memo(EditAuthorAffiliations);
