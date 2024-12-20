/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow, MTableAction } from '@material-table/core';
import { useTheme } from '@mui/material/styles';
import { numberToWords, validation } from 'config';
import AddCircle from '@mui/icons-material/AddCircle';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
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
import { TextField as CustomTextField } from 'modules/SharedComponents/Toolbox/TextField';

import { AFFILIATION_TYPE_NOT_UQ, ORG_TYPE_ID_UNIVERSITY, ORG_TYPES_LOOKUP, AFFILIATION_TYPE_UQ } from 'config/general';
import { default as globalLocale } from 'locale/global';
import IconButton from '@mui/material/IconButton';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Tooltip from '@mui/material/Tooltip';

import ViewAuthorAffiliations from './ViewAuthorAffiliations';
import EditAuthorAffiliations from './EditAuthorAffiliations';

import { hasAffiliationProblemsByAuthor } from 'helpers/authorAffiliations';
import { ChevronRight } from '@mui/icons-material';

const classes = {
    linked: {
        fontWeight: 500,
    },
    problem: {
        color: 'error.main',
        fontWeight: 500,
    },
};

const getIcon = ({ rowData, inProblemState }) => {
    if (!!inProblemState) {
        return (
            <ErrorOutlineOutlinedIcon
                color="error"
                id={`contributor-errorIcon-${rowData.aut_id}`}
                data-testid={`contributor-errorIcon-${rowData.aut_id}`}
            />
        );
    } else if (parseInt(rowData.uqIdentifier, 10)) {
        return <HowToRegIcon color="primary" id={`contributor-linked-${rowData.tableData.id}`} />;
    }
    /* istanbul ignore next */
    if (rowData.disabled) {
        /* istanbul ignore next */
        return <Lock color="secondary" id={`contributor-locked-${rowData.tableData.id}`} />;
    }
    return (
        <PersonOutlined
            color="secondary"
            id={`contributor-unlinked-${rowData.tableData.id}`}
            data-testid={`contributor-unlinked-${rowData.tableData.id}`}
        />
    );
};

export const NameAsPublished = React.memo(({ icon, text, linked }) => {
    return (
        <Grid container spacing={2}>
            <Grid sx={{ alignSelf: 'center', display: { xs: 'none', sm: 'block' } }}>{icon}</Grid>
            <Grid sx={{ ...(linked ? classes.linked : {}) }}>{text}</Grid>
        </Grid>
    );
});

NameAsPublished.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.element,
};

const isValid = value => !validation.isEmpty(value) && !validation.maxLength255Validator(value);

export const getColumns = ({ contributorEditorId, disabled, suffix, showRoleInput, locale, isNtro }) => {
    const linkedClass = (rowData, isProblem) =>
        // eslint-disable-next-line no-nested-ternary
        !!isProblem ? classes.problem : !!rowData.aut_id ? classes.linked : '';

    const {
        header: {
            locale: { nameColumn, roleColumn, identifierColumn, organisationColumn },
        },
        form: {
            locale: { creatorRoleLabel, creatorRoleHint, nameAsPublishedLabel, nameAsPublishedHint, identifierLabel },
        },
    } = locale;

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
                const inProblemState =
                    hasAffiliationProblemsByAuthor(rowData) &&
                    !!rowData.uqUsername &&
                    rowData.uqUsername !== '' &&
                    !isNtro;
                return (
                    <NameAsPublished
                        icon={getIcon({ rowData, disabled, inProblemState })}
                        text={
                            <React.Fragment>
                                <Typography
                                    variant="body2"
                                    sx={{ ...linkedClass(rowData, inProblemState) }}
                                    id={`${contributorEditorId}-list-row-${rowData.tableData.id}-name-as-published`}
                                    data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-name-as-published`}
                                >
                                    {rowData.nameAsPublished}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ ...linkedClass(rowData, inProblemState) }}
                                >{`${numberToWords(rowData.tableData.id + 1)} ${suffix}`}</Typography>
                            </React.Fragment>
                        }
                        linked={!!rowData.aut_id}
                    />
                );
            },
            editComponent: props => {
                return (
                    <Grid container spacing={2}>
                        <Grid style={{ alignSelf: 'center' }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <PersonOutlined color="secondary" />
                        </Grid>
                        <Grid style={{ flexGrow: '1' }}>
                            <CustomTextField
                                autoFocus
                                value={props.value || ''}
                                onChange={e => props.onChange(e.target.value)}
                                textFieldId={contributorEditorId}
                                error={!isValid(props.rowData?.nameAsPublished)}
                                errorText={validation.maxLength255Validator(props.rowData?.nameAsPublished)}
                                label={nameAsPublishedLabel}
                                placeholder={nameAsPublishedHint}
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                );
            },
            validate: rowData => isValid(rowData.nameAsPublished),
        },
        {
            cellStyle: () => ({
                verticalAlign: 'top',
            }),
            title: (
                <Typography variant="caption" color="secondary">
                    {identifierColumn}
                </Typography>
            ),
            field: 'uqIdentifier',
            render: rowData => {
                const inProblemState = hasAffiliationProblemsByAuthor(rowData);
                return (
                    <Typography
                        variant="body2"
                        sx={{ ...linkedClass(rowData, inProblemState) }}
                        id={`${contributorEditorId}-list-row-${rowData.tableData.id}-uq-identifiers`}
                        data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-uq-identifiers`}
                    >
                        {(!!rowData.uqUsername && `${rowData.uqUsername} - ${rowData.uqIdentifier}`) ||
                            (rowData.uqIdentifier !== '0' && rowData.uqIdentifier) ||
                            ''}
                    </Typography>
                );
            },
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
                        affiliations:
                            contributor.aut_id !== selectedItem.aut_id
                                ? []
                                : /* istanbul ignore next */ contributor.affiliations || /* istanbul ignore next */ [],
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
                              <Grid xs={12}>
                                  <Typography
                                      variant="body2"
                                      className={linkedClass(rowData)}
                                      id={`${contributorEditorId}-list-row-${rowData.tableData.id}-affiliation`}
                                      data-testid={`${contributorEditorId}-list-row-${rowData.tableData.id}-affiliation`}
                                  >
                                      {rowData.orgaff}
                                  </Typography>
                              </Grid>
                              <Grid xs={12}>
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

export const authorDetailPanel = ({ rowData, locale, isEditing, setEditing, onChange }) => {
    const {
        form: {
            locale: { affiliations: affiliationsLocale },
        },
    } = locale;

    return (
        <Grid container xs={11} xsOffset={1} sx={{ padding: 2 }} data-testid={`detailPanel-${rowData.aut_id}`}>
            <Typography variant="body2">
                {affiliationsLocale.title}
                {!isEditing && (
                    <Tooltip title={affiliationsLocale.editButton.tooltip}>
                        <IconButton
                            aria-label="delete"
                            onClick={() => setEditing({ editing: !isEditing, aut_id: rowData.aut_id })}
                            size={'small'}
                            id={`affiliationEditBtn-${rowData.aut_id}`}
                            data-testid={`affiliationEditBtn-${rowData.aut_id}`}
                        >
                            <PlaylistAddCheckIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Typography>
            {!isEditing && <ViewAuthorAffiliations rowData={rowData} onChange={onChange} locale={affiliationsLocale} />}
            {isEditing && (
                <EditAuthorAffiliations
                    rowData={rowData}
                    locale={affiliationsLocale}
                    isEditing={isEditing}
                    setEditing={setEditing}
                    onChange={onChange}
                />
            )}
        </Grid>
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
    loadOrganisationalUnitsList,
    loadSuggestedOrganisationalUnitsList,
    clearSuggestedOrganisationalUnits,
}) => {
    console.log({
        contributorEditorId,
        disabled,
        isNtro,
        list,
        locale,
        onChange,
        showRoleInput,
        loadOrganisationalUnitsList,
        loadSuggestedOrganisationalUnitsList,
        clearSuggestedOrganisationalUnits,
    });
    const [editState, setIsEditing] = useState({ editing: false, aut_id: undefined });

    // eslint-disable-next-line camelcase
    const setEditing = ({ editing, aut_id }) => {
        // eslint-disable-next-line camelcase
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
    const theme = useTheme();
    const materialTableRef = React.createRef();

    const columns = React.createRef();
    columns.current = getColumns({
        disabled,
        suffix,
        showRoleInput,
        locale,
        isNtro,
        contributorEditorId,
    });

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const tmpList = structuredClone(list);
        const result = [];
        tmpList.forEach((item, index) => {
            delete item.tableData;
            item.id = index;
            result.push({ ...item });
        });
        setData(result);
    }, [list]);

    const transformNewAuthorObject = newAuthor => [...data, { ...newAuthor, affiliations: [] }];

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
                    : transformNewAuthorObject(newData);
        }

        onChange(newList);
        setData(newList);

        materialTable.dataManager.changePaging(newList.length > 10);

        materialTable.setState({
            ...materialTable.dataManager.getRenderState(),
            showAddRow: false,
        });
    };

    const handleAffiliationUpdate = rowData => {
        const index = list.findIndex(item => item.aut_id === rowData.aut_id);
        const newList = [...list.slice(0, index), rowData, ...list.slice(index + 1)];
        onChange(newList);
        setData(newList);
    };

    return (
        <Box id={`${contributorEditorId}-list`} data-testid={`${contributorEditorId}-list`}>
            <MaterialTable
                tableRef={materialTableRef}
                columns={columns.current}
                components={{
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
                            !!!rowData.uqUsername || rowData.uqUsername === '' || isNtro || editState.editing
                                ? {
                                      icon: () => {
                                          return null;
                                      },
                                  }
                                : {
                                      icon: () => (
                                          <ChevronRight
                                              fontSize="medium"
                                              data-testid={`expandPanelIcon-${rowData.aut_id}`}
                                              id={`expandPanelIcon-${rowData.aut_id}`}
                                          />
                                      ),
                                  };

                        return {
                            ...conditionalIcon,
                            render: () => {
                                return !!!rowData.uqUsername || rowData.uqUsername === '' || isNtro
                                    ? /* istanbul ignore next */ null
                                    : authorDetailPanel({
                                          rowData,
                                          locale,
                                          isEditing: isEditing(rowData.aut_id),
                                          setEditing,
                                          onChange: handleAffiliationUpdate,
                                          loadOrganisationalUnitsList,
                                          loadSuggestedOrganisationalUnitsList,
                                          clearSuggestedOrganisationalUnits,
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
                    emptyRowsWhenPaging: false,
                    ...(data.length > 10 ? { maxBodyHeight: 600 } : {}),
                    ...(data.length > 10 ? { paging: true } : { paging: false }),
                    ...{ pageSize: /* istanbul ignore next */ data.length > 100 ? 50 : 10 },
                    pageSizeOptions: [10, 50, 100, 200, 500],
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
        </Box>
    );
};

AuthorsListWithAffiliates.propTypes = {
    contributorEditorId: PropTypes.string,
    disabled: PropTypes.bool,
    isNtro: PropTypes.bool,
    list: PropTypes.array,
    locale: PropTypes.object,
    onChange: PropTypes.func,
    showRoleInput: PropTypes.bool,
};

export default React.memo(AuthorsListWithAffiliates);
