/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow, MTableAction } from '@material-table/core';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { numberToWords } from 'config';
import AddCircle from '@mui/icons-material/AddCircle';
import Grid from '@mui/material/Unstable_Grid2';
import Edit from '@mui/icons-material/Edit';
import People from '@mui/icons-material/People';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Lock from '@mui/icons-material/Lock';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Delete from '@mui/icons-material/Delete';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import { tableIcons } from './AuthorsListIcons';
import OrgAffiliationTypeSelector from 'modules/SharedComponents/ContributorsEditor/components/OrgAffiliationTypeSelector';
import NonUqOrgAffiliationFormSection from 'modules/SharedComponents/ContributorsEditor/components/NonUqOrgAffiliationFormSection';
import Typography from '@mui/material/Typography';
import { UqIdField, RoleField } from 'modules/SharedComponents/LookupFields';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';

import { AFFILIATION_TYPE_NOT_UQ, ORG_TYPE_ID_UNIVERSITY, ORG_TYPES_LOOKUP, AFFILIATION_TYPE_UQ } from 'config/general';
import { default as globalLocale } from 'locale/global';
import { Autocomplete, Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { PRECISION } from 'helpers/authorAffiliations';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Box from '@mui/material/Box';

export const useStyles = makeStyles(theme => ({
    linked: {
        fontWeight: 500,
    },
    problem: {
        color: theme.palette.error.main,
        fontWeight: 500,
    },
}));

const getIcon = ({ rowData, inProblemState }) => {
    if (!!inProblemState) {
        return <ErrorOutlineOutlinedIcon color="error" id={`contributor-error-${rowData.tableData.id}`} />;
    } else if (parseInt(rowData.uqIdentifier, 10)) {
        return <HowToRegIcon color="primary" id={`contributor-linked-${rowData.tableData.id}`} />;
    } else if (rowData.disabled) {
        return <Lock color="secondary" id={`contributor-locked-${rowData.tableData.id}`} />;
    } else {
        return <PersonOutlined color="secondary" id={`contributor-unlinked-${rowData.tableData.id}`} />;
    }
};

export const NameAsPublished = React.memo(({ icon, text, linked }) => {
    const classes = useStyles();
    return (
        <Grid container spacing={2}>
            <Grid item style={{ alignSelf: 'center' }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                {icon}
            </Grid>
            <Grid item className={linked ? classes.linked : ''}>
                {text}
            </Grid>
        </Grid>
    );
});

NameAsPublished.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.element,
};

export const getColumns = ({
    contributorEditorId,
    disabled,
    suffix,
    classes,
    showRoleInput,
    locale,
    isNtro,
    problematicAffiliations,
}) => {
    const hasAffiliateProblem = rowData =>
        problematicAffiliations.filter(
            affiliate =>
                affiliate.rek_author_id === rowData.aut_id &&
                (affiliate.hasOrgAffiliations === false || affiliate.has100pcAffiliations === false),
        ).length > 0;

    const linkedClass = rowData =>
        // eslint-disable-next-line no-nested-ternary
        hasAffiliateProblem(rowData) ? classes.problem : !!rowData.aut_id ? classes.linked : '';

    const {
        header: {
            locale: { nameColumn, roleColumn, identifierColumn, organisationColumn },
        },
        form: {
            locale: { creatorRoleLabel, creatorRoleHint, nameAsPublishedLabel, nameAsPublishedHint, identifierLabel },
        },
    } = locale;

    /*

    rowData = {
        affiliation: "UQ"
        aut_display_name: "Lancaster, Steve"
        aut_id: 7624839
        aut_org_username: "uqslanca"
        aut_student_username: ""
        creatorRole: ""
        id: 8
        nameAsPublished: "Sibbald, Lee"
        orgaff: "The University of Queensland"
        orgtype: "453989"
        tableData: {index: 8, id: 8, uuid: "8aac7ff7-2d8b-48ad-94a7-f3b9f8a9288e"}
        uqIdentifier: "7624839"
        uqUsername: "uqslanca"
    }

    affiliationProblems = {
        aut_display_name: "Sibbald, Lee"
        isIncomplete: false
        isOrphaned: true
        rek_author_id: 7624847
    }

    */
    return [
        {
            title: (
                <NameAsPublished
                    icon={<People color="secondary" />}
                    text={
                        <Typography variant="caption" color="secondary">
                            {nameColumn}
                        </Typography>
                    }
                />
            ),
            field: 'nameAsPublished',
            render: rowData => {
                const inProblemState = hasAffiliateProblem(rowData);
                return (
                    <NameAsPublished
                        icon={getIcon({ rowData, disabled, inProblemState })}
                        text={
                            <React.Fragment>
                                <Typography
                                    variant="body2"
                                    className={linkedClass(rowData)}
                                    id={`${contributorEditorId}-list-row-${rowData.tableData.id}-name-as-published`}
                                    data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-name-as-published`}
                                >
                                    {rowData.nameAsPublished}
                                </Typography>
                                <Typography variant="caption" className={linkedClass(rowData)}>{`${numberToWords(
                                    rowData.tableData.id + 1,
                                )} ${suffix}`}</Typography>
                            </React.Fragment>
                        }
                        linked={!!rowData.aut_id}
                    />
                );
            },
            editComponent: props => {
                const { rowData: contributor } = props;
                return (
                    <Grid container spacing={2}>
                        <Grid item style={{ alignSelf: 'center' }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <PersonOutlined color="secondary" />
                        </Grid>
                        <Grid item style={{ flexGrow: '1' }}>
                            <TextField
                                autoFocus
                                value={props.value || ''}
                                onChange={e => props.onChange(e.target.value)}
                                textFieldId={contributorEditorId}
                                error={(contributor.nameAsPublished || '').length === 0}
                                label={nameAsPublishedLabel}
                                placeholder={nameAsPublishedHint}
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                );
            },
            validate: rowData => rowData.nameAsPublished !== '',
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {identifierColumn}
                </Typography>
            ),
            field: 'uqIdentifier',
            render: rowData => (
                <Typography
                    variant="body2"
                    className={linkedClass(rowData)}
                    id={`${contributorEditorId}-list-row-${rowData.tableData.id}-uq-identifiers`}
                    data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-uq-identifiers`}
                >
                    {(!!rowData.uqUsername && `${rowData.uqUsername} - ${rowData.uqIdentifier}`) ||
                        (rowData.uqIdentifier !== '0' && rowData.uqIdentifier) ||
                        ''}
                </Typography>
            ),
            editComponent: props => {
                const { rowData: contributor } = props;
                const prefilledSearch = !contributor.uqIdentifier || contributor.uqIdentifier === '0';
                const value =
                    (prefilledSearch && contributor.nameAsPublished) ||
                    (!!contributor.uqUsername && `${contributor.uqUsername} - ${contributor.uqIdentifier}`) ||
                    contributor.uqIdentifier;

                const handleChange = selectedItem => {
                    const newValue = {
                        ...selectedItem,
                        nameAsPublished:
                            contributor.nameAsPublished ||
                            (selectedItem &&
                                selectedItem.aut_lname &&
                                `${selectedItem.aut_lname}, ${selectedItem.aut_fname}`),
                        uqIdentifier: `${selectedItem.aut_id}`,
                        orgaff:
                            (contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ && globalLocale.global.orgTitle) ||
                            contributor.orgaff,
                        orgtype:
                            (contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ && ORG_TYPE_ID_UNIVERSITY) ||
                            contributor.orgtype,
                        uqUsername: `${selectedItem.aut_org_username ||
                            selectedItem.aut_student_username ||
                            selectedItem.aut_ref_num}`,
                    };
                    props.onRowDataChange({ ...contributor, ...newValue });
                };

                const handleClear = () => {
                    props.onRowDataChange({
                        nameAsPublished: contributor.nameAsPublished,
                        creatorRole: contributor.creatorRole,
                        orgaff: 'Missing',
                        orgtype: '',
                        uqIdentifier: '0',
                        uqUsername: '',
                        affiliation: '',
                    });
                };

                return (
                    <UqIdField
                        {...props}
                        clearOnInputClear
                        floatingLabelText={identifierLabel}
                        hintText="Type UQ author name to search"
                        uqIdFieldId={`${contributorEditorId}-id`}
                        key={!!contributor.uqIdentifier ? contributor.uqIdentifier : contributor.uqUsername || 'aut-id'}
                        onChange={handleChange}
                        onClear={handleClear}
                        value={value}
                        prefilledSearch={prefilledSearch}
                    />
                );
            },
            searchable: true,
        },
        ...(showRoleInput
            ? [
                  {
                      title: (
                          <Typography variant="caption" color="secondary">
                              {roleColumn}
                          </Typography>
                      ),
                      field: 'creatorRole',
                      render: rowData => (
                          <Typography
                              variant="body2"
                              className={linkedClass(rowData)}
                              id={`${contributorEditorId}-list-row-${rowData.tableData.id}-role`}
                              data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-role`}
                          >
                              {rowData.creatorRole}
                          </Typography>
                      ),
                      editComponent: props => {
                          const { rowData: contributor } = props;
                          const handleChange = selectedItem => {
                              const newValue = {
                                  ...contributor,
                                  creatorRole: selectedItem,
                              };
                              props.onRowDataChange({ ...contributor, ...newValue });
                          };
                          return (
                              <RoleField
                                  {...props}
                                  fullWidth
                                  key={`role-input-${(contributor.nameAsPublished || '').trim().length === 0}`}
                                  id="creator-role-field"
                                  floatingLabelText={creatorRoleLabel}
                                  hintText={creatorRoleHint}
                                  onChange={handleChange}
                                  disabled={disabled || (contributor.nameAsPublished || '').trim().length === 0}
                                  required
                                  autoComplete="off"
                                  allowFreeText
                                  error={
                                      (contributor.nameAsPublished || '').trim().length === 0
                                          ? false
                                          : (contributor.creatorRole || '').trim().length === 0
                                  }
                                  value={
                                      !!contributor.creatorRole
                                          ? { value: contributor.creatorRole, text: contributor.creatorRole }
                                          : null
                                  }
                              />
                          );
                      },
                  },
              ]
            : []),
        ...(isNtro
            ? [
                  {
                      title: (
                          <Typography variant="caption" color="secondary">
                              {organisationColumn}
                          </Typography>
                      ),
                      field: 'orgaff',
                      render: rowData => (
                          <Grid container>
                              <Grid item xs={12}>
                                  <Typography
                                      variant="body2"
                                      className={linkedClass(rowData)}
                                      id={`${contributorEditorId}-list-row-${rowData.tableData.id}-affiliation`}
                                      data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-affiliation`}
                                  >
                                      {rowData.orgaff}
                                  </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                  <Typography
                                      variant="caption"
                                      className={linkedClass(rowData)}
                                      id={`${contributorEditorId}-list-row-${rowData.tableData.id}-affiliation-type`}
                                      data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-affiliation-type`}
                                  >
                                      {`${(!!rowData.orgtype &&
                                          !!ORG_TYPES_LOOKUP[rowData.orgtype] &&
                                          `Organisation type: ${ORG_TYPES_LOOKUP[rowData.orgtype]}`) ||
                                          ''}`}
                                  </Typography>
                              </Grid>
                          </Grid>
                      ),
                      editComponent: props => {
                          const { rowData: contributor } = props;

                          const handleOrgAffliationChange = event => {
                              props.onRowDataChange({ ...contributor, orgaff: event.target.value });
                          };
                          const handleOrgTypeChange = event => {
                              props.onRowDataChange({ ...contributor, orgtype: event.target.value });
                          };
                          const handleAffiliationChange = event => {
                              const affiliation = event.target.value;
                              props.onRowDataChange({
                                  ...contributor,
                                  affiliation: affiliation,
                                  orgaff:
                                      (affiliation === AFFILIATION_TYPE_UQ && globalLocale.global.orgTitle) ||
                                      contributor.orgaff,
                                  orgtype:
                                      (affiliation === AFFILIATION_TYPE_UQ && ORG_TYPE_ID_UNIVERSITY) ||
                                      contributor.orgtype,
                              });
                          };
                          return (
                              <React.Fragment>
                                  {isNtro && (
                                      <OrgAffiliationTypeSelector
                                          affiliation={contributor.affiliation}
                                          onAffiliationChange={handleAffiliationChange}
                                          disabled={disabled}
                                      />
                                  )}
                                  {contributor.affiliation === AFFILIATION_TYPE_NOT_UQ && (
                                      <NonUqOrgAffiliationFormSection
                                          {...props}
                                          orgAffiliation={contributor.orgaff}
                                          orgType={contributor.orgtype}
                                          onOrgAffiliationChange={handleOrgAffliationChange}
                                          onOrgTypeChange={handleOrgTypeChange}
                                          disableAffiliationEdit={disabled}
                                          disableOrgTypeEdit={disabled}
                                          fullWidthFields
                                      />
                                  )}
                              </React.Fragment>
                          );
                      },
                  },
              ]
            : []),
    ];
};

const AuthorDetailPanelContent = ({
    rowData,
    problematicAffiliations,
    authorAffiliations,
    isEditing,
    setEditing,
    organisationUnits,
    suggestedOrganisationalUnitList = {},
    loadSuggestedOrganisationalUnitsList,
}) => {
    const theme = useTheme();

    const {
        suggestedOrganisationUnits,
        suggestedOrganisationUnitsLoading,
        suggestedOrganisationUnitsFailed,
    } = suggestedOrganisationalUnitList;

    console.log(
        'AuthorDetailPanelContent',
        organisationUnits,
        isEditing,
        suggestedOrganisationUnits,
        suggestedOrganisationUnitsLoading,
        suggestedOrganisationUnitsFailed,
    );

    /*
    suggested:
        aut_id: 7624839
        org_id: 1248
        org_title: "Information Systems and Resource Services (University of Queensland Library)"
    */
    /*
    org units
        org_desc: null
        org_ext_table: null
        org_extdb_id: null
        org_extdb_name: "hr"
        org_id: 1062
        org_image_filename: null
        org_is_current: 1
        org_title: "!NON-HERDC"

    */
    if (
        isEditing &&
        suggestedOrganisationUnits.length === 0 &&
        suggestedOrganisationUnitsLoading === false &&
        suggestedOrganisationUnitsFailed === false
    ) {
        loadSuggestedOrganisationalUnitsList(rowData.aut_id);
        return <ContentLoader message={'Loading suggested Organisational Units'} />;
    }
    // HERE, compile array for autocomplete that handles duplicates coming from suggestions - any item in suggested is
    // probably already in the main array of items. Use Set to auto remove dupes. Need to consider what the data
    // structure look like for autocomplete, since we want to prepend "Suggested: " and change the colour using
    // probably renderOption={(props, option) => (

    const affiliations = authorAffiliations.filter(item => item.af_author_id === rowData.aut_id);
    const problems = problematicAffiliations.filter(item => item.rek_author_id === rowData.aut_id);
    const alertOptions = { title: '', message: '' };
    const combinedArr = suggestedOrganisationUnits.concat(organisationUnits);
    const uniqueIds = Array.from(new Set(combinedArr.map(item => item.org_id)));
    const uniqueOrgs = uniqueIds.map(id => combinedArr.find(obj => obj.org_id === id));
    console.log('uniqueOrgs', combinedArr, uniqueIds, uniqueOrgs);

    if (problems.length > 0) {
        if (problems[0].has100pcAffiliations === false) {
            alertOptions.title = 'Author affiliation information is incomplete';
            if (affiliations.length > 0) {
                alertOptions.message = 'Percentage sum total of all affiliations must equal 100%';
                alertOptions.action = props => console.log(props);
                alertOptions.actionButtonLabel = 'Recalculate Percentages';
            } else {
                alertOptions.message = 'Author requires at least one affiliation to be added';
            }
        } else if (problems[0].hasOrgAffiliations === false) {
            alertOptions.title = 'Orphaned organisation affiliation information';
            alertOptions.message = 'Organisation(s) no longer exists';
            alertOptions.action = props => console.log(props);
            alertOptions.actionButtonLabel = 'Remove Orphaned Affiliations';
        }
    }

    console.log('problematicAffiliations', problematicAffiliations, affiliations, problems, alertOptions);
    return (
        <Grid container xs={11} xsOffset={1} sx={{ padding: 2 }}>
            <Typography variant="body2">
                Affiliations{' '}
                {!isEditing && (
                    <IconButton
                        aria-label="delete"
                        onClick={() => setEditing({ editing: !isEditing, aut_id: rowData.aut_id })}
                        size={'small'}
                    >
                        <EditIcon />
                    </IconButton>
                )}
            </Typography>

            {!isEditing && (
                <Grid container xs={12} spacing={2}>
                    <Grid xs={12} sx={{ borderBlockEnd: '1px solid #ccc' }}>
                        <Typography variant="caption">Organisational Unit</Typography>
                    </Grid>
                    {affiliations.map((item, index) => (
                        <React.Fragment key={index}>
                            <Grid xs={2}>
                                <Chip
                                    label={`${Number(item.af_percent_affiliation / PRECISION)}%`}
                                    variant="outlined"
                                    size={'small'}
                                    color={problems.length > 0 ? 'error' : 'primary'}
                                />
                            </Grid>
                            <Grid xs={10}>
                                <Typography variant="body2" color={problems.length > 0 ? 'error' : 'primary'}>
                                    {item.fez_org_structure?.[0].org_title ?? 'Organisational Unit has been removed'}
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    ))}
                    {affiliations.length === 0 && (
                        <>
                            <Grid xs={2}>
                                <Chip label={'0%'} variant="outlined" size={'small'} color={'error'} />
                            </Grid>
                            <Grid xs={10}>
                                <Typography variant="body2" color={'error'}>
                                    No affiliations have been added
                                </Typography>
                            </Grid>
                        </>
                    )}
                    {problems.length > 0 && (
                        <Grid xs={12}>
                            <Alert type={'warning'} {...alertOptions} />
                        </Grid>
                    )}
                </Grid>
                // HERE, continue to update the layout sections here to make
                // them in line with the mocks, then get to work on
                // a) bringing in data, b) saving data, c) making sure that
                // data still works after exiting/re-entering edit state, d) showing error state banner
            )}
            {isEditing && (
                <Grid container xs={12} alignItems={'center'} spacing={2}>
                    <Grid xs={7} sx={{ borderBlockEnd: '1px solid #ccc' }}>
                        <Typography variant="caption">Organisational Unit</Typography>
                    </Grid>
                    <Grid xs={4} sx={{ borderBlockEnd: '1px solid #ccc' }}>
                        <Typography variant="caption">Affiliation %</Typography>
                    </Grid>

                    {affiliations.map(item => (
                        <>
                            <Grid xs={7} padding={1}>
                                <Autocomplete
                                    value={uniqueOrgs.find(org => org.org_id === item.af_org_id)}
                                    options={uniqueOrgs}
                                    getOptionLabel={option => option.org_title}
                                    sel
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            sx={{
                                                ...(!!option.suggested ? { color: theme.palette.primary.main } : {}),
                                            }}
                                            {...props}
                                            key={option.org_id}
                                        >
                                            {option.org_title}
                                        </Box>
                                    )}
                                    renderInput={params => (
                                        <TextField {...params} placeholder="Start typing or select from list" />
                                    )}
                                />
                            </Grid>
                            <Grid xs={4} padding={1}>
                                <Chip
                                    label={`${Number(item.af_percent_affiliation / PRECISION)}%`}
                                    variant="outlined"
                                    size={'small'}
                                    color={'primary'}
                                />
                            </Grid>
                            <Grid xs={1} justifyContent={'flex-end'} padding={1}>
                                <IconButton aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </>
                    ))}
                    <Grid xs={7} padding={1}>
                        <Autocomplete
                            options={uniqueOrgs}
                            getOptionLabel={option => option.org_title}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    sx={{ ...(!!option.suggested ? { color: theme.palette.primary.main } : {}) }}
                                    {...props}
                                    key={option.org_id}
                                >
                                    {option.org_title}
                                </Box>
                            )}
                            renderInput={params => (
                                <TextField {...params} placeholder="Start typing or select from list" />
                            )}
                        />
                    </Grid>

                    <Grid container xs={12} justifyContent={'flex-end'}>
                        <Button onClick={() => setEditing({ editing: !isEditing, aut_id: rowData.aut_id })}>
                            Cancel
                        </Button>
                        <Button onClick={() => setEditing({ editing: !isEditing, aut_id: rowData.aut_id })}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

/* istanbul ignore next */
export const AuthorDetailPanel = ({
    rowData,
    problematicAffiliations,
    authorAffiliations,
    isEditing,
    setEditing,
    organisationUnits,
    suggestedOrganisationalUnitList,
    loadSuggestedOrganisationalUnitsList,
}) => {
    return (
        <AuthorDetailPanelContent
            rowData={rowData}
            problematicAffiliations={problematicAffiliations}
            authorAffiliations={authorAffiliations}
            isEditing={isEditing}
            setEditing={setEditing}
            organisationUnits={organisationUnits}
            suggestedOrganisationalUnitList={suggestedOrganisationalUnitList}
            loadSuggestedOrganisationalUnitsList={loadSuggestedOrganisationalUnitsList}
        />
    );
};

export const AuthorsListWithAffiliates = ({
    contributorEditorId,
    disabled,
    isNtro,
    list,
    locale,
    onChange,
    showRoleInput,
    problematicAffiliations,
    authorAffiliations,
    organisationalUnitList,
    suggestedOrganisationalUnitList,
    loadOrganisationalUnitsList,
    loadSuggestedOrganisationalUnitsList,
}) => {
    const { organisationUnits, organisationUnitsLoading, organisationUnitsFailed } = organisationalUnitList;

    if (organisationUnits.length === 0 && organisationUnitsLoading === false && organisationUnitsFailed === false) {
        // dispatch
        loadOrganisationalUnitsList();
    }

    const [editState, setIsEditing] = useState({ editing: false, aut_id: undefined });

    // eslint-disable-next-line camelcase
    const setEditing = ({ editing, aut_id }) => {
        setIsEditing({ editing, aut_id });
    };

    // eslint-disable-next-line camelcase
    const isEditing = aut_id => {
        // eslint-disable-next-line camelcase
        return editState.editing && editState.aut_id === aut_id;
    };

    const {
        row: {
            locale: {
                // deleteRecordConfirmation,
                moveUpHint,
                moveDownHint,
                deleteHint,
                editHint,
                // selectHint,
                // lockedTooltip,
                suffix,
            },
        },
        form: {
            locale: { addButton },
        },
    } = locale;
    const classes = useStyles();
    const theme = useTheme();
    const materialTableRef = React.createRef();
    // const columns = React.useMemo(
    //    () =>
    const columns = React.createRef();
    columns.current = getColumns({
        disabled,
        suffix,
        classes,
        showRoleInput,
        locale,
        isNtro,
        contributorEditorId,
        problematicAffiliations,
        authorAffiliations,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //    [editState.editing],
    // );

    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        const result = [];
        list.forEach((item, index) => {
            delete item.tableData;
            item.id = index;
            result.push({ ...item });
        });
        setData(result);
    }, [list]);
    const handleAuthorUpdate = (action, newData, oldData) => {
        const materialTable = materialTableRef.current;
        let newList = [...data];

        if (action === 'delete') {
            const index = oldData.tableData.id;
            newList = [...data.slice(0, index), ...data.slice(index + 1)];
        } else if (
            action === 'update' &&
            data.filter(
                (contributor, index) =>
                    index !== oldData.tableData.id && !!contributor.aut_id && contributor.aut_id === newData.aut_id,
            ).length > 0
        ) {
            newList = [...data];
        } else if (
            action === 'add' &&
            data.filter(contributor => !!contributor.aut_id && contributor.aut_id === newData.aut_id).length > 0
        ) {
            newList = [...data];
        } else {
            newList =
                action === 'update'
                    ? [...data.slice(0, oldData.tableData.id), newData, ...data.slice(oldData.tableData.id + 1)]
                    : [...data, newData];
        }

        onChange(newList);
        setData(newList);

        materialTable.dataManager.changePaging(newList.length > 10);

        materialTable.setState({
            ...materialTable.dataManager.getRenderState(),
            showAddRow: false,
        });
    };

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                // Container: props => (
                //     <div {...props} id={`${contributorEditorId}-list`} data-testid={`${contributorEditorId}-list`} />
                // ),
                Action: props => {
                    if (typeof props.action !== 'function' && !props.action.action && !props.action.isFreeAction) {
                        const { icon: Icon, tooltip, ...restAction } = props.action;
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    icon: () => (
                                        <Icon
                                            id={`${contributorEditorId}-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase()}`}
                                            data-testid={`${contributorEditorId}-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase()}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else {
                        return <MTableAction {...props} />;
                    }
                },
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        id={`${contributorEditorId}-list-row-${props.index}`}
                        data-testid={`${contributorEditorId}-list-row-${props.index}`}
                    />
                ),
                EditRow: props => (
                    <MTableEditRow
                        {...props}
                        id={`${contributorEditorId}-list-edit-row-${props.index}`}
                        data-testid={`${contributorEditorId}-list-edit-row-${props.index}`}
                        onEditingApproved={handleAuthorUpdate}
                    />
                ),
            }}
            actions={[
                rowData => ({
                    icon: props => <KeyboardArrowUp {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-up`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-up`,
                    },
                    tooltip: moveUpHint,
                    disabled:
                        disabled ||
                        editState.editing ||
                        (rowData.itemIndex && /* istanbul ignore next */ rowData.itemIndex === 0) ||
                        rowData.tableData.id === 0,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = {
                            ...data[index - 1],
                        };
                        const newRowData = { ...rowData };
                        delete newRowData.tableData;
                        const newList = [
                            ...data.slice(0, index - 1),
                            { ...newRowData },
                            nextContributor,
                            ...data.slice(index + 1),
                        ];
                        const newIndexedList = [];
                        newList.map((item, index) => {
                            newIndexedList.push({ ...item, id: index });
                        });

                        setData(newIndexedList);
                        onChange(newIndexedList);
                    },
                }),
                rowData => ({
                    icon: props => <KeyboardArrowDown {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                    },
                    tooltip: `${moveDownHint}-${rowData.tableData.id}`,
                    disabled: disabled || editState.editing || rowData.tableData.id === data.length - 1,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index + 1];
                        const newRowData = { ...rowData };
                        delete newRowData.tableData;
                        const newList = [
                            ...data.slice(0, index),
                            nextContributor,
                            newRowData,
                            ...data.slice(index + 2),
                        ];
                        const newIndexedList = [];
                        newList.map((item, index) => {
                            newIndexedList.push({ ...item, id: index });
                        });

                        setData(newIndexedList);
                    },
                }),
                rowData => ({
                    icon: props => <Edit {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                    },
                    disabled: editState.editing || disabled,
                    tooltip: editHint,
                    onClick: () => {
                        const materialTable = materialTableRef.current;
                        materialTable.dataManager.changeRowEditing(rowData, 'update');
                        materialTable.setState({
                            ...materialTable.dataManager.getRenderState(),
                        });
                    },
                }),
                rowData => ({
                    icon: props => <Delete {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-delete`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-delete`,
                    },
                    disabled: editState.editing || disabled,
                    tooltip: deleteHint,
                    onClick: () => {
                        const materialTable = materialTableRef.current;
                        materialTable.dataManager.changeRowEditing(rowData, 'delete');
                        materialTable.setState({
                            ...materialTable.dataManager.getRenderState(),
                        });
                    },
                }),
                {
                    icon: props => <AddCircle {...props} color="primary" fontSize="large" />,
                    iconProps: {
                        id: `${contributorEditorId}-add`,
                        'data-testid': `${contributorEditorId}-add`,
                    },
                    isFreeAction: true,
                    tooltip: addButton,
                    disabled: editState.editing || disabled,
                    onClick: () => {
                        const materialTable = materialTableRef.current;
                        materialTable.dataManager.changeRowEditing();
                        materialTable.setState({
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: true,
                        });
                    },
                },
            ]}
            data={data}
            icons={tableIcons}
            title=""
            detailPanel={[
                rowData => {
                    const conditionalIcon =
                        rowData.uqUsername === '' || isNtro || editState.editing
                            ? {
                                  icon: () => {
                                      return null;
                                  },
                              }
                            : {};

                    return {
                        ...conditionalIcon,
                        render: () => {
                            return rowData.uqUsername === '' || isNtro
                                ? null
                                : AuthorDetailPanel({
                                      rowData,
                                      problematicAffiliations,
                                      authorAffiliations,
                                      isEditing: isEditing(rowData.aut_id),
                                      setEditing,
                                      organisationUnits,
                                      suggestedOrganisationalUnitList,
                                      loadSuggestedOrganisationalUnitsList,
                                  });
                        },
                    };
                },
            ]}
            editable={{
                onRowUpdateCancelled: () => {},
            }}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                addRowPosition: 'first',
                search: data.length > 10,
                emptyRowsWhenPaging: true,
                ...(data.length > 10 ? { maxBodyHeight: 550 } : {}),
                ...(data.length > 10 ? { paging: true } : { paging: false }),
                .../* istanbul ignore next */ (data.length > 100 ? { pageSize: data.length > 100 ? 50 : 5 } : {}),
                pageSizeOptions: [5, 50, 100, 200, 500],
                padding: 'dense',
                rowStyle: rowData => {
                    if (!!rowData.aut_id) {
                        return {
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.primary.main,
                        };
                    } else {
                        return {};
                    }
                },
                overflowY: list.length > 10 ? 'auto' : 'hidden',
            }}
        />
    );
};

AuthorsListWithAffiliates.propTypes = {
    contributorEditorId: PropTypes.string,
    disabled: PropTypes.bool,
    isNtro: PropTypes.bool,
    list: PropTypes.array,
    locale: PropTypes.object,
    problematicAffiliations: PropTypes.array,
    authorAffiliations: PropTypes.array,
    onChange: PropTypes.func,
    showRoleInput: PropTypes.bool,
    organisationalUnitList: PropTypes.object.isRequired,
    suggestedOrganisationalUnitList: PropTypes.object.isRequired,
    loadOrganisationalUnitsList: PropTypes.func,
    loadSuggestedOrganisationalUnitsList: PropTypes.func,
};

export default React.memo(AuthorsListWithAffiliates);