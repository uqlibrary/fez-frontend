/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable, MRT_EditActionButtons } from 'material-react-table';

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
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

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

import { useMrtTable } from 'hooks';
import { head } from 'lodash';
// import { validationRules } from './validationRules';

const MUI_SAVE_BUTTON_CLASS = '.MuiIconButton-colorInfo';

const classes = {
    linked: {
        fontWeight: 500,
    },
    problem: {
        color: 'error.main',
        fontWeight: 500,
    },
};

const getIcon = ({ rowData, disabled, inProblemState }) => {
    if (!!inProblemState) {
        return (
            <ErrorOutlineOutlinedIcon
                color="error"
                id={`contributor-errorIcon-${rowData.aut_id}`}
                data-testid={`contributor-errorIcon-${rowData.aut_id}`}
            />
        );
    } else if (parseInt(rowData.uqIdentifier, 10)) {
        return <HowToRegIcon color="primary" id={`contributor-linked-${rowData.aut_id}`} />; // rowdata.index
    }
    /* istanbul ignore next */
    if (disabled) {
        /* istanbul ignore next */
        return <Lock color="secondary" id={`contributor-locked-${rowData.aut_id}`} />; // rowdata.index
    }
    return (
        <PersonOutlined
            color="secondary"
            id={`contributor-unlinked-${rowData.aut_id}`} // rowdata.index
            data-testid={`contributor-unlinked-${rowData.aut_id}`} // rowdata.index
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

export const AuthorDetailPanel = ({ rowData, locale, isEditing, setEditing, onChange }) => {
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
    const theme = useTheme();
    const [editState, setIsEditing] = useState({ editing: false, aut_id: undefined });
    const prevList = React.useRef('');

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
        header: {
            locale: { nameColumn, roleColumn, identifierColumn, organisationColumn },
        },
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
            locale: {
                addButton,
                creatorRoleLabel,
                creatorRoleHint,
                nameAsPublishedLabel,
                nameAsPublishedHint,
                identifierLabel,
            },
        },
        deleteConfirmationLocale,
    } = locale;

    const validationRules = [
        {
            id: 'nameAsPublished',
            validate: rowData => {
                const valid = isValid(rowData.nameAsPublished);
                return (
                    !valid && {
                        field: 'nameAsPublished',
                        message: 'required',
                    }
                );
            },
        },
    ];

    const {
        data,
        isBusy,
        pendingDeleteRowId,
        isOpen,
        editingRow,
        validationErrors,
        setData,
        setBusy,
        setDeleteRow,
        resetDeleteRow,
        setEditRow,
        resetEditRow,
        validate,
        getValidationError,
        handleValidation,
        clearValidationErrors,
    } = useMrtTable(list, validationRules);

    const linkedClass = (rowData, isProblem) =>
        // eslint-disable-next-line no-nested-ternary
        !!isProblem ? classes.problem : !!rowData.aut_id ? classes.linked : '';

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nameAsPublished',
                header: nameColumn,
                Header: ({ column }) => (
                    <NameAsPublished
                        icon={<People color="secondary" />}
                        text={
                            <Typography variant="caption" color="secondary">
                                {column.columnDef.header}
                            </Typography>
                        }
                    />
                ),
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    const rowData = { ...row.original, ...row._valuesCache };
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
                                        id={`${contributorEditorId}-list-row-${row.index}-name-as-published`}
                                        data-testid={`${contributorEditorId}-list-row-${row.index}-name-as-published`}
                                    >
                                        {value}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ ...linkedClass(rowData, inProblemState) }}
                                    >{`${numberToWords(row.index + 1)} ${suffix}`}</Typography>
                                </React.Fragment>
                            }
                            linked={!!rowData.aut_id}
                        />
                    );
                },
                Edit: ({ row, column }) => {
                    const value = row._valuesCache.nameAsPublished;
                    const errors = validationErrors[row.id] || [];
                    const error = getValidationError(errors, 'nameAsPublished');

                    const handleChange = e => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            [column.id]: e.target.value || null,
                        };
                        handleValidation(row, column.id, e.target.value || null);
                    };

                    return (
                        <Grid container spacing={2}>
                            <Grid style={{ alignSelf: 'center' }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <PersonOutlined color="secondary" />
                            </Grid>
                            <Grid style={{ flexGrow: '1' }}>
                                <CustomTextField
                                    autoFocus
                                    value={value}
                                    onChange={handleChange}
                                    textFieldId={contributorEditorId}
                                    error={!!error}
                                    errorText={validation.maxLength255Validator(value)}
                                    label={nameAsPublishedLabel}
                                    placeholder={nameAsPublishedHint}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    );
                },
                size: 400,
                grow: true,
            },
            {
                accessorKey: 'uqIdentifier',
                header: identifierColumn,
                Header: ({ column }) => (
                    <Typography variant="caption" color="secondary">
                        {column.columnDef.header}
                    </Typography>
                ),
                Cell: ({ row }) => {
                    const rowData = { ...row.original, ...row._valuesCache };
                    const identifierText =
                        (!!rowData.uqUsername && `${rowData.uqUsername} - ${rowData.uqIdentifier}`) ||
                        (rowData.uqIdentifier && rowData.uqIdentifier !== '0' ? rowData.uqIdentifier : '');
                    return (
                        <Typography
                            variant="body2"
                            id={`${contributorEditorId}-list-row-${row.id}-uq-identifiers`}
                            data-testid={`${contributorEditorId}-list-row-${row.id}-uq-identifiers`}
                        >
                            {identifierText}
                        </Typography>
                    );
                },
                Edit: ({ table, row }) => {
                    const contributor = { ...row.original, ...row._valuesCache };
                    const prefilledSearch = !contributor.uqIdentifier || contributor.uqIdentifier === '0';
                    const value =
                        (prefilledSearch && contributor.nameAsPublished) ||
                        (!!contributor.uqUsername && `${contributor.uqUsername} - ${contributor.uqIdentifier}`) ||
                        contributor.uqIdentifier;

                    const handleChange = selectedItem => {
                        const newValueCache = {
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
                                    : /* istanbul ignore next */ contributor.affiliations ||
                                      /* istanbul ignore next */ [],
                        };
                        const updatedValues = {
                            ...row._valuesCache,
                            ...newValueCache,
                        };
                        row._valuesCache = updatedValues;
                        // table.setEditingRow({ ...row });
                        handleValidation(row, 'nameAsPublished', newValueCache.nameAsPublished);
                    };

                    const handleClear = () => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            nameAsPublished: contributor.nameAsPublished,
                            uqIdentifier: '0',
                            creatorRole: contributor.creatorRole,
                            orgaff: 'Missing',
                        };
                        row.original = {
                            ...row.original,
                            orgtype: '',
                            uqUsername: '',
                            affiliation: '',
                        };
                        handleValidation(row, 'nameAsPublished', contributor.nameAsPublished);
                    };

                    return (
                        <UqIdField
                            clearOnInputClear
                            floatingLabelText={identifierLabel}
                            hintText="Type UQ author name to search"
                            uqIdFieldId={`${contributorEditorId}-id`}
                            key={
                                !!contributor.uqIdentifier
                                    ? contributor.uqIdentifier
                                    : contributor.uqUsername || 'aut-id'
                            }
                            onChange={handleChange}
                            onClear={handleClear}
                            value={value}
                            prefilledSearch={prefilledSearch}
                        />
                    );
                },
                size: 300,
                grow: true,
            },
            {
                accessorKey: 'creatorRole',
                header: roleColumn,
                Header: ({ column }) => (
                    <Typography variant="caption" color="secondary">
                        {column.columnDef.header}
                    </Typography>
                ),
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    const rowData = { ...row.original, ...row._valuesCache };
                    return (
                        <Typography
                            variant="body2"
                            className={linkedClass(rowData)}
                            id={`${contributorEditorId}-list-row-${row.id}-role`}
                            data-testid={`${contributorEditorId}-list-row-${row.id}-role`}
                        >
                            {value}
                        </Typography>
                    );
                },
                Edit: ({ row }) => {
                    const handleChange = selectedItem => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            creatorRole: selectedItem,
                        };
                    };
                    return (
                        <RoleField
                            fullWidth
                            key={`role-input-${(row._valuesCache.nameAsPublished || '').trim().length === 0}`}
                            id="creator-role-field"
                            floatingLabelText={creatorRoleLabel}
                            hintText={creatorRoleHint}
                            onChange={handleChange}
                            disabled={disabled || (row._valuesCache.nameAsPublished || '').trim().length === 0}
                            required
                            autoComplete="off"
                            allowFreeText
                            error={
                                (row._valuesCache.nameAsPublished || '').trim().length === 0
                                    ? false
                                    : (row._valuesCache.creatorRole || '').trim().length === 0
                            }
                            value={
                                !!row._valuesCache.creatorRole
                                    ? { value: row._valuesCache.creatorRole, text: row._valuesCache.creatorRole }
                                    : null
                            }
                        />
                    );
                },
            },
            {
                accessorKey: 'orgaff',
                header: organisationColumn,
                Header: ({ column }) => (
                    <Typography variant="caption" color="secondary">
                        {column.columnDef.header}
                    </Typography>
                ),
                Cell: ({ row }) => {
                    const rowData = { ...row.original, ...row._valuesCache };
                    return (
                        <Grid container>
                            <Grid xs={12}>
                                <Typography
                                    variant="body2"
                                    className={linkedClass(rowData)}
                                    id={`${contributorEditorId}-list-row-${row.id}-affiliation`}
                                    data-testid={`${contributorEditorId}-list-row-${row.id}-affiliation`}
                                >
                                    {rowData.orgaff}
                                </Typography>
                            </Grid>
                            <Grid xs={12}>
                                <Typography
                                    variant="caption"
                                    className={linkedClass(rowData)}
                                    id={`${contributorEditorId}-list-row-${row.id}-affiliation-type`}
                                    data-testid={`${contributorEditorId}-list-row-${row.id}-affiliation-type`}
                                >
                                    {`${(!!rowData.orgtype &&
                                        !!ORG_TYPES_LOOKUP[rowData.orgtype] &&
                                        `Organisation type: ${ORG_TYPES_LOOKUP[rowData.orgtype]}`) ||
                                        ''}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    );
                },
                Edit: ({ row }) => {
                    const contributor = { ...row.original, ...row._valuesCache };

                    const handleOrgAffliationChange = event => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            orgaff: event.target.value,
                        };
                    };
                    const handleOrgTypeChange = event => {
                        row.original = {
                            ...row.original,
                            orgtype: event.target.value,
                        };
                    };
                    const handleAffiliationChange = event => {
                        const affiliation = event.target.value;
                        row._valuesCache = {
                            ...row._valuesCache,
                            orgaff:
                                (affiliation === AFFILIATION_TYPE_UQ && globalLocale.global.orgTitle) ||
                                contributor.orgaff,
                        };
                        row.original = {
                            ...row.original,
                            affiliation: affiliation,
                            orgtype:
                                (affiliation === AFFILIATION_TYPE_UQ && ORG_TYPE_ID_UNIVERSITY) || contributor.orgtype,
                        };
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
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disabled, getValidationError, handleValidation, validationErrors],
    );

    React.useEffect(() => {
        const listStr = JSON.stringify(list);
        /* istanbul ignore else */
        if (prevList.current !== listStr) {
            prevList.current = listStr;
            const result = [];
            list.forEach((item, index) => {
                delete item.tableData;
                item.id = index;
                result.push({ ...item });
            });
            setData(result);
        }
    }, [list, setData]);

    const transformNewAuthorObject = newAuthor => {
        delete newAuthor['mrt-row-actions'];
        return [...data, { ...newAuthor, affiliations: [] }];
    };

    const handleCreate = ({ values, table, row }) => {
        const newAuthor = { ...row.original, ...row._valuesCache, ...values };

        const errors = validate(newAuthor);
        /* istanbul ignore if  */
        if (!!errors) {
            return;
        }
        const transformedAuthorList = transformNewAuthorObject(newAuthor);

        table.setCreatingRow(null);
        resetEditRow();

        onChange(transformedAuthorList);
        setData(transformedAuthorList);
    };

    const handleEdit = ({ values, table, row }) => {
        const updatedAuthor = { ...row.original, ...row._valuesCache, ...values };
        const errors = validate(updatedAuthor);
        /* istanbul ignore if  */
        if (!!errors) {
            return;
        }

        const updatedAuthorList = [...data];
        const target = updatedAuthorList.find(el => el.aut_id === row.original.aut_id);
        const index = updatedAuthorList.indexOf(target);
        updatedAuthorList[index] = updatedAuthor;

        table.setEditingRow(null);
        resetEditRow();

        onChange(updatedAuthorList);
        setData(updatedAuthorList);
    };

    const handleDeleteApproved = () => {
        const row = data.find(row => row.aut_id === pendingDeleteRowId);
        setBusy();
        try {
            const dataDelete = [...data];
            const target = dataDelete.find(el => el.aut_id === row.aut_id);
            const index = dataDelete.indexOf(target);
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
        } catch (error) {
            console.error('Error deleting row:', error);
        } finally {
            setBusy(false);
        }
    };

    const handleAffiliationUpdate = rowData => {
        const index = list.findIndex(item => item.aut_id === rowData.aut_id);
        const newList = [...list.slice(0, index), rowData, ...list.slice(index + 1)];
        onChange(newList);
        setData(newList);
    };

    // DELETE action
    const openDeleteConfirmModal = id => () => {
        setDeleteRow(id);
    };

    const cancelDeleteConfirmModal = () => {
        resetDeleteRow();
    };

    const table = useMaterialReactTable({
        columns,
        data,
        getRowId: row => row.aut_id,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        enableExpandAll: false,
        enableColumnDragging: false,
        enableColumnResizing: false,
        enableRowDragging: false,
        enableRowSelection: false,
        enableColumnActions: false,
        enableColumnFilterModes: false,
        enablePagination: false,
        enableToolbarInternalActions: false,
        positionActionsColumn: 'last',
        manualExpanding: true,
        state: {
            showAlertBanner: false,
            showLoadingOverlay: isBusy,
        },
        displayColumnDefOptions: {
            'mrt-row-actions': { minSize: 100, size: 100 },
            'mrt-row-expand': { header: '', maxSize: 20, grow: 0, size: '20px' },
        },
        renderDetailPanel: ({ row }) => {
            const conditionalIcon =
                !!!row.original.uqUsername || row.original.uqUsername === '' || isNtro || editState.editing
                    ? {
                          icon: () => {
                              return null;
                          },
                      }
                    : {
                          icon: () => (
                              <ChevronRight
                                  fontSize="medium"
                                  data-testid={`expandPanelIcon-${row.original.aut_id}`}
                                  id={`expandPanelIcon-${row.original.aut_id}`}
                              />
                          ),
                      };

            return !!!row.original.uqUsername || row.original.uqUsername === '' || isNtro ? (
                /* istanbul ignore next */ <></>
            ) : (
                <AuthorDetailPanel
                    rowData={row.original}
                    locale={locale}
                    isEditing={isEditing(row.original.aut_id)}
                    setEditing={setEditing}
                    onChange={handleAffiliationUpdate}
                    loadOrganisationalUnitsList={loadOrganisationalUnitsList}
                    loadSuggestedOrganisationalUnitsList={loadSuggestedOrganisationalUnitsList}
                    clearSuggestedOrganisationalUnits
                />
            );
        },

        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip title={addButton}>
                <IconButton
                    id={`${contributorEditorId}-${addButton.toLowerCase().replace(/ /g, '-')}`}
                    data-testid={`${contributorEditorId}-${addButton.toLowerCase().replace(/ /g, '-')}`}
                    disabled={disabled || table.getState().creatingRow !== null}
                    onClick={() => {
                        resetEditRow();
                        table.setEditingRow(null);
                        table.setCreatingRow(true);
                        // immediately force validation of new row
                        handleValidation({ id: 'mrt-row-create' }, columns[0].accessorKey, '');
                    }}
                    sx={{ marginLeft: 'auto' }}
                >
                    <AddCircle
                        color="primary"
                        fontSize="large"
                        id={`${contributorEditorId}-add`}
                        data-testid={`${contributorEditorId}-add`}
                    />
                </IconButton>
            </Tooltip>
        ),
        renderRowActions: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Tooltip title={moveUpHint}>
                        <IconButton
                            onClick={() => {
                                const index = row.index;
                                if (index > 0) {
                                    const newData = [...data];
                                    const temp = newData[index - 1];
                                    newData[index - 1] = newData[index];
                                    newData[index] = temp;
                                    setData(newData);
                                    onChange(newData);
                                }
                            }}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow || row.index === 0}
                            id={`${contributorEditorId}-list-row-${row.index}-move-up`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-move-up`}
                            size="small"
                            color="primary"
                        >
                            <KeyboardArrowUp />
                        </IconButton>{' '}
                    </Tooltip>
                    <Tooltip title={moveDownHint}>
                        <IconButton
                            onClick={() => {
                                const index = row.index;
                                if (index < data.length - 1) {
                                    const newData = [...data];
                                    const temp = newData[index + 1];
                                    newData[index + 1] = newData[index];
                                    newData[index] = temp;
                                    setData(newData);
                                    onChange(newData);
                                }
                            }}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow || row.index === data.length - 1}
                            id={`${contributorEditorId}-list-row-${row.index}-move-down`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-move-down`}
                            size="small"
                            color="primary"
                        >
                            <KeyboardArrowDown />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={editHint}>
                        <IconButton
                            onClick={() => {
                                setEditRow(row);
                                table.setCreatingRow(null);
                                table.setEditingRow(row);
                            }}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
                            id={`${contributorEditorId}-list-row-${row.index}-${editHint
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-${editHint
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            size="small"
                            color="primary"
                        >
                            <tableIcons.Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={deleteHint}>
                        <IconButton
                            onClick={openDeleteConfirmModal(row.id)}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
                            id={`${contributorEditorId}-list-row-${row.index}-${deleteHint
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            data-testid={`${contributorEditorId}-list-row-${
                                row.index
                            }-${deleteHint.toLowerCase().replace(/ /g, '-')}`}
                            size="small"
                            color="primary"
                        >
                            <tableIcons.Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },
        onCreatingRowCancel: () => {
            resetEditRow();
            clearValidationErrors();
        },
        onCreatingRowSave: handleCreate,
        onEditingRowSave: handleEdit,
        onEditingRowCancel: () => setEditRow(null),
        initialState: {
            columnVisibility: { creatorRole: showRoleInput, orgaff: isNtro },
            density: 'compact',
            expanded: false,
        },
        icons: {
            SortIcon: props => (
                <tableIcons.SortArrow
                    id={`${contributorEditorId}-${!!editingRow ? 'edit' : 'add'}-sort`}
                    data-testid={`${contributorEditorId}-${!!editingRow ? 'edit' : 'add'}-sort`}
                    color="secondary"
                    {...props}
                />
            ),
            SaveIcon: props => (
                <tableIcons.Check
                    id={`${contributorEditorId}-${!!editingRow ? 'edit' : 'add'}-save`}
                    data-testid={`${contributorEditorId}-${!!editingRow ? 'edit' : 'add'}-save`}
                    color="secondary"
                    {...props}
                />
            ),
            CancelIcon: props => (
                <tableIcons.Clear
                    id={`${contributorEditorId}-${!!editingRow ? 'edit' : 'add'}-cancel`}
                    data-testid={`${contributorEditorId}-${!!editingRow ? 'edit' : 'add'}-cancel`}
                    color="secondary"
                    {...props}
                />
            ),
        },
        muiTableContainerProps: {
            sx: {
                ...(data.length > 10 ? { maxHeight: '500px' } : {}),
            },
        },
        muiTableProps: {
            sx: {
                borderCollapse: 'collapse',
            },
        },
        muiTableHeadCellProps: ({ column }) => ({
            sx: {
                '& .Mui-TableHeadCell-Content': {
                    ...(column.id === 'mrt-row-actions' ? { justifyContent: 'center' } : {}),
                },
            },
        }),
        muiTableBodyCellProps: ({ column }) => ({
            sx: {
                '&:last-of-type > div': {
                    gap: 0,
                    [`&:has(${MUI_SAVE_BUTTON_CLASS})`]: { flexDirection: 'row-reverse', justifyContent: 'flex-end' },
                },
                '&:not(:last-child)': { alignContent: column.id === 'mrt-row-expand' ? 'center' : 'flex-start' },
                ...(column.id === 'mrt-row-actions' ? { justifyContent: 'flex-end' } : {}),
            },
        }),
        muiTableBodyRowProps: ({ row }) => ({
            id: `${contributorEditorId}-list-row-${row.index === -1 ? 'add' : row.index}`,
            'data-testid': `${contributorEditorId}-list-row-${row.index === -1 ? 'add' : row.index}`,
            sx: {
                ...(!!row.original.aut_id
                    ? { backgroundColor: theme.palette.secondary.light, color: theme.palette.primary.main }
                    : {}),
            },
        }),
        muiDetailPanelProps: ({ row }) => ({
            sx: {
                backgroundColor: theme.palette.background.paper,
            },
        }),
        muiExpandButtonProps: {
            sx: { alignSelf: 'center' },
        },
    });

    return (
        <Box
            id={`${contributorEditorId}-list`}
            data-testid={`${contributorEditorId}-list`}
            sx={{ '& .MuiPaper-root': { border: 0, boxShadow: 0 } }}
        >
            <ConfirmationBox
                confirmationBoxId={`${contributorEditorId}-delete-author-confirmation`}
                onAction={handleDeleteApproved}
                onClose={cancelDeleteConfirmModal}
                isOpen={isOpen}
                locale={deleteConfirmationLocale}
            />{' '}
            <MaterialReactTable table={table} />
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
