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

const EditAuthorAffiliations = ({
    rowData,
    setEditing,
    onChange,
    organisationUnits,
    suggestedOrganisationalUnitList = {}, // from redux
    loadSuggestedOrganisationalUnitsList,
}) => {
    const uniqueOrgs = useRef([]);
    const theme = useTheme();

    const recalculatedAffiliations = calculateAffiliationPercentile(rowData.affiliations);
    const [currentAffiliations, dispatch] = useReducer(editAffiliationReducer, recalculatedAffiliations);

    const {
        suggestedOrganisationUnits,
        suggestedOrganisationUnitsLoading,
        suggestedOrganisationUnitsFailed,
    } = suggestedOrganisationalUnitList;

    if (uniqueOrgs.current.length === 0 && suggestedOrganisationUnits.length > 0) {
        const combinedArr = suggestedOrganisationUnits.concat(organisationUnits);
        const uniqueIds = Array.from(new Set(combinedArr.map(item => item.org_id)));
        uniqueOrgs.current = uniqueIds.map(id => combinedArr.find(obj => obj.org_id === id));
    }

    const currentAffiliationOrgIds = currentAffiliations.map(item => item.af_org_id) ?? [];

    if (
        suggestedOrganisationUnits.length === 0 &&
        suggestedOrganisationUnitsLoading === false &&
        suggestedOrganisationUnitsFailed === false
    ) {
        loadSuggestedOrganisationalUnitsList(rowData.aut_id);
    }
    if (suggestedOrganisationUnits.length === 0 && suggestedOrganisationUnitsFailed === false) {
        return <ContentLoader message={'Loading suggested Organisational Units'} />;
    }
    const actionHandler = {
        [ACTIONS.CHANGE]: (currentAffiliation, organisation) => {
            const newAffiliation = deepClone(currentAffiliation);
            newAffiliation.af_org_id = organisation.org_id;
            newAffiliation.fez_org_structure = { ...organisation };
            dispatch({
                type: ACTIONS.CHANGE,
                affiliation: newAffiliation,
            });
        },
        [ACTIONS.DELETE]: index => {
            dispatch({
                type: ACTIONS.DELETE,
                index,
            });
        },
        [ACTIONS.ADD]: (rowData, organisation) => {
            const newAffiliation = createNewAffiliationObject(rowData, organisation);
            dispatch({
                type: ACTIONS.ADD,
                affiliation: newAffiliation,
            });
        },
        [ACTIONS.NONHERDC]: (rowData, organisation) => {
            const nonHerdcAffiliation = createNewAffiliationObject(rowData, organisation);
            const suggestedAffiliation = createNewAffiliationObject(
                rowData,
                suggestedOrganisationUnits[0],
                nonHerdcAffiliation.af_id + 100, // ensure the af_id value is different to the previous call
            );
            dispatch({
                type: ACTIONS.NONHERDC,
                nonHerdcAffiliation,
                suggestedAffiliation,
            });
        },
    };

    return (
        <Grid container xs={12} alignItems={'center'} spacing={2}>
            <Grid xs={7} sx={{ borderBlockEnd: '1px solid #ccc' }}>
                <Typography variant="caption">Organisational Unit</Typography>
            </Grid>
            <Grid xs={5} sx={{ borderBlockEnd: '1px solid #ccc' }}>
                <Typography variant="caption">Affiliation %</Typography>
            </Grid>

            {currentAffiliations.map((item, index) => (
                <React.Fragment key={`${item.af_author_id}-${item.af_id}`}>
                    <Grid xs={7} padding={1}>
                        <Autocomplete
                            clearOnBlur
                            disableClearable
                            value={
                                uniqueOrgs.current?.find(org => org.org_id === item.af_org_id) ?? {
                                    org_title: 'Organisation missing',
                                }
                            }
                            options={uniqueOrgs.current ?? []}
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
                                    {!!option.suggested ? `Suggested: ${option.org_title}` : option.org_title}
                                </Box>
                            )}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    size={'small'}
                                    variant={'standard'}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: 'Start typing or select from list',
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        error: !!!uniqueOrgs.current?.find(org => org.org_id === item.af_org_id),
                                    }}
                                />
                            )}
                            onChange={(_, newValue) => {
                                if (isNonHerdc(newValue)) actionHandler[ACTIONS.NONHERDC](rowData, newValue);
                                else {
                                    actionHandler[ACTIONS.CHANGE](item, newValue);
                                }
                            }}
                        />
                    </Grid>
                    <Grid xs={4} padding={1}>
                        <Chip
                            label={`${Number(item.af_percent_affiliation / PRECISION)}%`}
                            variant="outlined"
                            size={'small'}
                            color={
                                !!uniqueOrgs.current?.find(org => org.org_id === item.af_org_id) ? 'primary' : 'error'
                            }
                        />
                    </Grid>

                    <Grid xs={1} justifyContent={'flex-end'} padding={1}>
                        {(hasNonHerdc(currentAffiliations) === false || isNonHerdc(item)) && (
                            <IconButton aria-label="delete" onClick={() => actionHandler[ACTIONS.DELETE](index)}>
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
                            uniqueOrgs.current?.filter(org => !currentAffiliationOrgIds.includes(org.org_id)) ?? []
                        }
                        getOptionLabel={option => option.org_title}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                sx={{ ...(!!option.suggested ? { color: theme.palette.primary.main } : {}) }}
                                {...props}
                                key={option.org_id}
                            >
                                {!!option.suggested ? `Suggested: ${option.org_title}` : option.org_title}
                            </Box>
                        )}
                        renderInput={params => (
                            <TextField
                                {...params}
                                size={'small'}
                                variant={'standard'}
                                placeholder="Start typing or select from list"
                            />
                        )}
                        onChange={(event, newValue) => {
                            console.log(newValue, isNonHerdc(newValue));
                            if (isNonHerdc(newValue)) actionHandler[ACTIONS.NONHERDC](rowData, newValue);
                            else actionHandler[ACTIONS.ADD](rowData, newValue);
                        }}
                    />
                </Grid>
            )}
            <Grid container xs={12} justifyContent={'flex-end'}>
                <Button onClick={() => setEditing({ editing: false, aut_id: rowData.aut_id })}>Cancel</Button>
                <Button
                    onClick={() => {
                        const newRowData = { ...rowData, affiliations: [...currentAffiliations] };
                        onChange(newRowData);
                        setEditing({ editing: false, aut_id: rowData.aut_id });
                    }}
                    disabled={hasAffiliationProblems(currentAffiliations)}
                >
                    Save
                </Button>
            </Grid>
        </Grid>
    );
};

EditAuthorAffiliations.propTypes = {
    rowData: PropTypes.object.isRequired,
    setEditing: PropTypes.func,
    onChange: PropTypes.func,
    organisationUnits: PropTypes.array,
    suggestedOrganisationalUnitList: PropTypes.object,
    loadSuggestedOrganisationalUnitsList: PropTypes.func,
};

export default React.memo(EditAuthorAffiliations);
