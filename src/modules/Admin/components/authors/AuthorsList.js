/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useTheme } from '@mui/material/styles';
import { numberToWords } from 'config';
import AddCircle from '@mui/icons-material/AddCircle';
import Grid from '@mui/material/Grid';
import People from '@mui/icons-material/People';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Lock from '@mui/icons-material/Lock';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { tableIcons } from './AuthorsListIcons';
import OrgAffiliationTypeSelector from 'modules/SharedComponents/ContributorsEditor/components/OrgAffiliationTypeSelector';
import NonUqOrgAffiliationFormSection from 'modules/SharedComponents/ContributorsEditor/components/NonUqOrgAffiliationFormSection';
import Typography from '@mui/material/Typography';
import { UqIdField, RoleField } from 'modules/SharedComponents/LookupFields';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { validation } from 'config';

import {
    AFFILIATION_TYPE_NOT_UQ,
    ORG_TYPE_ID_UNIVERSITY,
    ORG_TYPES_LOOKUP,
    AFFILIATION_TYPE_UQ,
    AUTHOR_EXTERNAL_IDENTIFIER_TYPE,
} from 'config/general';
import { default as globalLocale } from 'locale/global';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField/components/NewGenericSelectField';

import { useMrtTable } from 'hooks';
import { default as defaultValidationRules, extendedValidationRules } from './validationRules';

const MUI_SAVE_BUTTON_CLASS = '.MuiIconButton-colorInfo';

const classes = {
    linked: {
        fontWeight: 500,
    },
};

const getIcon = ({ index, rowData, disabled }) => {
    if (parseInt(rowData.uqIdentifier, 10)) {
        return <HowToRegIcon color="primary" id={`contributor-linked-${index}`} />;
    } else if (disabled) {
        return <Lock color="secondary" id={`contributor-locked-${index}`} />;
    } else {
        return <PersonOutlined color="secondary" id={`contributor-unlinked-${index}`} />;
    }
};

export const NameAsPublished = React.memo(({ icon, text, linked }) => {
    return (
        <Grid container spacing={2}>
            <Grid item sx={{ alignSelf: 'center', display: { xs: 'none', sm: 'block' } }}>
                {icon}
            </Grid>
            <Grid item sx={{ ...(linked ? classes.linked : {}) }}>
                {text}
            </Grid>
        </Grid>
    );
});

NameAsPublished.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.element,
    linked: PropTypes.bool,
};

/* istanbul ignore next */
export const AuthorDetail = rowData => {
    return (
        <Grid container item xs={12} style={{ padding: 16 }}>
            <Grid item xs={2}>
                <Typography variant="subtitle2">{'Organisation affiliation'}</Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="body2">{rowData.rowData.orgaff}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="subtitle2">{'Organisation type'}</Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="body2">{rowData.rowData.orgtype}</Typography>
            </Grid>
        </Grid>
    );
};

export const AuthorsList = ({
    contributorEditorId,
    disabled,
    isNtro,
    list,
    locale,
    onChange,
    showRoleInput,
    showExternalIdentifierInput,
}) => {
    const theme = useTheme();
    const [triggerState, setTriggerState] = useState(true);
    const prevList = React.useRef('[]');

    const validationRules = showExternalIdentifierInput
        ? [...defaultValidationRules, ...extendedValidationRules]
        : defaultValidationRules;

    const {
        tablePageSizeOptions,
        largeListDefaultPageSize,
        header: {
            locale: {
                nameColumn,
                roleColumn,
                identifierColumn,
                organisationColumn,
                externalIdentifierColumn,
                externalIdentifierTypeColumn,
            },
        },
        row: {
            locale: { moveUpHint, moveDownHint, deleteHint, editHint, suffix, deleteRecordConfirmation },
        },
        form: {
            locale: {
                addButton,
                creatorRoleLabel,
                creatorRoleHint,
                nameAsPublishedLabel,
                nameAsPublishedHint,
                identifierLabel,
                externalIdentifierLabel,
                externalIdentifierHint,
                externalIdentifierTypeLabel,
            },
        },
    } = locale;

    const {
        data,
        isBusy,
        pendingDeleteRowId,
        isPendingDelete,
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

    const linkedClass = rowData => (!!rowData.aut_id ? classes.linked : {});

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

                    return (
                        <NameAsPublished
                            icon={getIcon({ index: row.index, rowData, disabled })}
                            text={
                                <React.Fragment>
                                    <Typography
                                        variant="body2"
                                        sx={{ ...linkedClass(rowData) }}
                                        id={`${contributorEditorId}-list-row-${row.index}-name-as-published`}
                                        data-testid={`${contributorEditorId}-list-row-${row.index}-name-as-published`}
                                    >
                                        {value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ ...linkedClass(rowData) }}>{`${numberToWords(
                                        row.index + 1,
                                    )} ${suffix}`}</Typography>
                                </React.Fragment>
                            }
                            linked={!!rowData.aut_id}
                        />
                    );
                },
                Edit: ({ row, column }) => {
                    const value = row._valuesCache.nameAsPublished || '';
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
                            <Grid item style={{ alignSelf: 'center' }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <PersonOutlined color="secondary" />
                            </Grid>
                            <Grid item style={{ flexGrow: '1' }}>
                                <TextField
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
                size: 250,
                minSize: 250,
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
                            id={`${contributorEditorId}-list-row-${row.index}-uq-identifiers`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-uq-identifiers`}
                        >
                            {identifierText}
                        </Typography>
                    );
                },
                Edit: ({ row }) => {
                    const contributor = { ...row.original, ...row._valuesCache };
                    const prefilledSearch = !contributor.uqIdentifier || contributor.uqIdentifier === '0';
                    const value =
                        (prefilledSearch && contributor.nameAsPublished) ||
                        (!!contributor.uqUsername && `${contributor.uqUsername} - ${contributor.uqIdentifier}`) ||
                        contributor.uqIdentifier ||
                        '';

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
                            fullWidth
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
                size: 150,
                minSize: 150,
                grow: true,
            },
            {
                accessorKey: 'externalIdentifier',
                header: externalIdentifierColumn,
                Header: ({ column }) => (
                    <Typography variant="caption" color="secondary">
                        {column.columnDef.header}
                    </Typography>
                ),
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return (
                        <Typography
                            variant="body2"
                            id={`${contributorEditorId}-list-row-${row.index}-external-identifier`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-external-identifier`}
                        >
                            {value}
                        </Typography>
                    );
                },
                Edit: ({ row, column }) => {
                    const value = row._valuesCache.externalIdentifier || '';
                    const errors = validationErrors[row.id] || [];
                    const error = getValidationError(errors, 'externalIdentifier');

                    const handleChange = e => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            [column.id]: e.target.value || null,
                        };
                        handleValidation(row, column.id, e.target.value || null);
                    };
                    return (
                        <Grid container spacing={2}>
                            <Grid item style={{ flexGrow: '1' }}>
                                <TextField
                                    value={value}
                                    onChange={handleChange}
                                    textFieldId={`${contributorEditorId}-external-identifier`}
                                    error={!!error}
                                    errorText={error}
                                    label={externalIdentifierLabel}
                                    placeholder={externalIdentifierHint}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    );
                },
                size: 175,
                grow: true,
            },
            {
                accessorKey: 'externalIdentifierType',
                header: externalIdentifierTypeColumn,
                Header: ({ column }) => (
                    <Typography variant="caption" color="secondary">
                        {column.columnDef.header}
                    </Typography>
                ),
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return (
                        <Typography
                            variant="body2"
                            id={`${contributorEditorId}-list-row-${row.index}-external-identifier-type`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-external-identifier-type`}
                        >
                            {AUTHOR_EXTERNAL_IDENTIFIER_TYPE.find(type => type.value === value)?.text}
                        </Typography>
                    );
                },
                Edit: ({ row, column }) => {
                    const contributor = { ...row.original, ...row._valuesCache };
                    const value = contributor.externalIdentifierType || '';

                    const handleChange = value => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            [column.id]: value || null,
                        };
                        handleValidation(row, column.id, value || null);
                    };
                    return (
                        <Grid container spacing={2}>
                            <Grid item style={{ flexGrow: '1' }}>
                                <NewGenericSelectField
                                    itemsList={AUTHOR_EXTERNAL_IDENTIFIER_TYPE}
                                    onChange={handleChange}
                                    value={value}
                                    key={`${contributor.externalIdentifierType}-${contributor.externalIdentifier}`}
                                    genericSelectFieldId={`${contributorEditorId}-external-identifier-type`}
                                    label={externalIdentifierTypeLabel}
                                />
                            </Grid>
                        </Grid>
                    );
                },
                size: 150,
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
                            id={`${contributorEditorId}-list-row-${row.index}-role`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-role`}
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
                                    : ''
                            }
                        />
                    );
                },
                size: 200,
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
                                    id={`${contributorEditorId}-list-row-${row.index}-affiliation`}
                                    data-testid={`${contributorEditorId}-list-row-${row.index}-affiliation`}
                                >
                                    {rowData.orgaff}
                                </Typography>
                            </Grid>
                            <Grid xs={12}>
                                <Typography
                                    variant="caption"
                                    className={linkedClass(rowData)}
                                    id={`${contributorEditorId}-list-row-${row.index}-affiliation-type`}
                                    data-testid={`${contributorEditorId}-list-row-${row.index}-affiliation-type`}
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
                    const [stateAffType, setStateAffType] = React.useState(contributor.affiliation);
                    const [stateOrgAff, setStateOrgAff] = React.useState(contributor.orgaff || '');

                    const handleOrgAffliationChange = event => {
                        const orgaff = event.target.value || '';
                        row._valuesCache = {
                            ...row._valuesCache,
                            orgaff,
                        };
                        setStateOrgAff(orgaff);
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
                        setStateAffType(affiliation);
                    };
                    return (
                        <React.Fragment>
                            {isNtro && (
                                <Grid container>
                                    <Grid xs={12}>
                                        <OrgAffiliationTypeSelector
                                            affiliation={contributor.affiliation}
                                            onAffiliationChange={handleAffiliationChange}
                                            disabled={disabled}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {stateAffType === AFFILIATION_TYPE_NOT_UQ && (
                                <NonUqOrgAffiliationFormSection
                                    orgAffiliation={stateOrgAff}
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
                muiTableBodyCellProps: () => ({
                    sx: {
                        flexDirection: 'column',
                    },
                }),
                size: 250,
                minSize: 200,
                maxSize: 300,
                grow: true,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disabled, getValidationError, handleValidation, validationErrors],
    );

    React.useEffect(() => {
        const listStr = JSON.stringify(list);
        if (prevList.current !== listStr) {
            prevList.current = listStr;
            const result = [];
            list.forEach((item, index) => {
                delete item.tableData;
                item.id = index;
                result.push({ ...item });
            });
            setData(result);

            if (triggerState) {
                setTriggerState(false);
                onChange(result);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

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

        const duplicate =
            data.filter(contributor => !!contributor.aut_id && contributor.aut_id === newAuthor.aut_id).length > 0;

        if (duplicate) {
            table.setCreatingRow(null);
            resetEditRow();
            setData([...data]);
            return;
        }

        const transformedAuthorList = transformNewAuthorObject(newAuthor);
        setData(transformedAuthorList);
        table.setCreatingRow(null);
        resetEditRow();

        onChange(transformedAuthorList);
    };

    const handleEdit = ({ values, table, row }) => {
        const updatedAuthor = { ...row.original, ...row._valuesCache, ...values };
        const errors = validate(updatedAuthor);
        /* istanbul ignore if  */
        if (!!errors) {
            return;
        }

        const duplicate =
            data.filter(
                (contributor, index) =>
                    index !== row.index && !!contributor.aut_id && contributor.aut_id === updatedAuthor.aut_id,
            ).length > 0;

        if (duplicate) {
            table.setEditingRow(null);
            resetEditRow();
            setData([...data]);
            return;
        }

        const updatedAuthorList = [...data];
        const target = updatedAuthorList.find(el => el.aut_id === row.original.aut_id);
        const index = updatedAuthorList.indexOf(target);
        updatedAuthorList[index] = updatedAuthor;
        setData(updatedAuthorList);
        table.setEditingRow(null);
        resetEditRow();

        onChange(updatedAuthorList);
    };

    const handleDeleteApproved = () => {
        setBusy();
        try {
            const dataDelete = [...data];
            dataDelete.splice(pendingDeleteRowId, 1);
            setData(dataDelete);
            onChange(dataDelete);
        } catch (error) {
            /* istanbul ignore next */
            console.error('Error deleting row:', error);
        } finally {
            setBusy(false);
        }
    };

    // DELETE action
    const openDeleteConfirmModal = index => () => {
        setDeleteRow(index);
    };

    const cancelDeleteConfirmModal = () => {
        resetDeleteRow();
    };

    const table = useMaterialReactTable({
        columns,
        data,
        layoutMode: 'grid',
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        enableStickyHeader: true,
        enablePagination: data.length > 10,
        enableFilters: data.length > 10,
        enableExpandAll: false,
        enableColumnDragging: false,
        enableColumnResizing: false,
        enableRowDragging: false,
        enableRowSelection: false,
        enableColumnActions: false,
        enableColumnOrdering: false,
        enableColumnFilterModes: false,
        enableGrouping: false,
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableColumnFilters: false,
        positionActionsColumn: 'last',
        initialState: {
            density: 'compact',
            expanded: false,
            pagination: { pageSize: data.length > 100 ? largeListDefaultPageSize : 10, pageIndex: 0 },
        },
        state: {
            showAlertBanner: false,
            showLoadingOverlay: isBusy,
            columnVisibility: {
                nameAsPublished: true,
                uqIdentifier: true,
                externalIdentifier: showExternalIdentifierInput,
                externalIdentifierType: showExternalIdentifierInput,
                creatorRole: showRoleInput,
                orgaff: isNtro,
            },
        },
        displayColumnDefOptions: {
            'mrt-row-actions': {
                minSize: 100,
                size: 100,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    sx: {
                        justifyContent: 'flex-end',
                        '& > div': {
                            gap: 0,
                            [`&:has(${MUI_SAVE_BUTTON_CLASS})`]: {
                                flexDirection: 'row-reverse',
                                justifyContent: 'center',
                            },
                        },
                    },
                },
            },
            'mrt-row-expand': {
                header: '',
                maxSize: 20,
                grow: 0,
                size: 20,
                muiTableBodyRowProps: {
                    sx: {
                        alignContent: 'center',
                    },
                },
            },
        },
        muiTableContainerProps: {
            sx: {
                ...(data.length > 10 ? { maxHeight: '650px' } : {}),
            },
        },
        muiTableProps: {
            sx: {
                borderCollapse: 'collapse',
            },
        },
        muiTableBodyCellProps: ({ column }) => ({
            sx: {
                alignItems: column.id === 'mrt-row-expand' ? 'center' : 'flex-start',
            },
        }),
        muiDetailPanelProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
                '& .MuiCollapse-root': {
                    width: '100%',
                },
            },
        },
        muiPaginationProps: {
            rowsPerPageOptions: tablePageSizeOptions,
            showFirstButton: false,
            showLastButton: false,
        },
        muiSearchTextFieldProps: {
            id: `${contributorEditorId}-search`,
            inputProps: {
                'data-testid': `${contributorEditorId}-search`,
            },
        },
        icons: {
            SaveIcon: props => (
                <tableIcons.Check
                    id={`${contributorEditorId}-${!!editingRow ? 'update' : 'add'}-save`}
                    data-testid={`${contributorEditorId}-${!!editingRow ? 'update' : 'add'}-save`}
                    color="secondary"
                    {...props}
                />
            ),
            CancelIcon: props => (
                <tableIcons.Clear
                    id={`${contributorEditorId}-${!!editingRow ? 'update' : 'add'}-cancel`}
                    data-testid={`${contributorEditorId}-${!!editingRow ? 'update' : 'add'}-cancel`}
                    color="secondary"
                    {...props}
                />
            ),
        },
        muiExpandButtonProps: ({ table, row }) => ({
            id: `expandPanelIcon-${row.original.aut_id}`,
            ['data-testid']: `expandPanelIcon-${row.original.aut_id}`,
            sx: {
                alignSelf: 'center',
            },
            disabled: isPendingDelete || !!isBusy || !!editingRow || table.getState().creatingRow !== null,
        }),
        ...(!isNtro
            ? {
                  renderDetailPanel: ({ row }) => {
                      return <AuthorDetail rowData={{ ...row.original, ...row._valuesCache }} />;
                  },
              }
            : {}),

        muiTopToolbarProps: {
            sx: { '& div:last-of-type': { flexDirection: 'row-reverse', justifyContent: 'flex-start' } },
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
        renderRowActions: ({ table, row }) => {
            return (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Tooltip title={moveUpHint}>
                        <IconButton
                            onClick={() => {
                                const index = row.index;
                                /* istanbul ignore else */
                                if (index > 0) {
                                    const newData = [...data];
                                    const temp = newData[index - 1];
                                    newData[index - 1] = newData[index];
                                    newData[index] = temp;
                                    setData(newData);
                                    onChange(newData);
                                }
                            }}
                            disabled={
                                isPendingDelete ||
                                !!isBusy ||
                                !!editingRow ||
                                row.index === 0 ||
                                table.getState().creatingRow !== null
                            }
                            id={`${contributorEditorId}-list-row-${row.index}-move-up`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-move-up`}
                            size="small"
                            color="primary"
                        >
                            <KeyboardArrowUp />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={moveDownHint}>
                        <IconButton
                            onClick={() => {
                                const index = row.index;
                                /* istanbul ignore else */
                                if (index < data.length - 1) {
                                    const newData = [...data];
                                    const temp = newData[index + 1];
                                    newData[index + 1] = newData[index];
                                    newData[index] = temp;
                                    setData(newData);
                                    onChange(newData);
                                }
                            }}
                            disabled={
                                isPendingDelete ||
                                !!isBusy ||
                                !!editingRow ||
                                row.index === data.length - 1 ||
                                table.getState().creatingRow !== null
                            }
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
                            disabled={
                                disabled ||
                                !!pendingDeleteRowId ||
                                !!isBusy ||
                                !!editingRow ||
                                table.getState().creatingRow !== null
                            }
                            id={`${contributorEditorId}-list-row-${row.index}-edit`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-edit`}
                            size="small"
                            color="primary"
                        >
                            <tableIcons.Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={deleteHint}>
                        <IconButton
                            onClick={openDeleteConfirmModal(row.index)}
                            disabled={
                                disabled ||
                                isPendingDelete ||
                                !!isBusy ||
                                !!editingRow ||
                                table.getState().creatingRow !== null
                            }
                            id={`${contributorEditorId}-list-row-${row.index}-delete`}
                            data-testid={`${contributorEditorId}-list-row-${row.index}-delete`}
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
        muiTableBodyRowProps: ({ isDetailPanel, row }) => ({
            id: `${contributorEditorId}-list-row-${row.index === -1 ? 'add' : row.index}${
                isDetailPanel ? '-detailPanel' : ''
            }`,
            'data-testid': `${contributorEditorId}-list-row-${row.index === -1 ? 'add' : row.index}${
                isDetailPanel ? '-detailPanel' : ''
            }`,
            sx: {
                ...(!!row.original.aut_id
                    ? { backgroundColor: theme.palette.secondary.light, color: theme.palette.primary.main }
                    : {}),
            },
        }),
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
                locale={deleteRecordConfirmation}
            />{' '}
            <MaterialReactTable table={table} />
        </Box>
    );
};

AuthorsList.propTypes = {
    contributorEditorId: PropTypes.string,
    disabled: PropTypes.bool,
    isNtro: PropTypes.bool,
    list: PropTypes.array,
    locale: PropTypes.object,
    onChange: PropTypes.func,
    showRoleInput: PropTypes.bool,
    showExternalIdentifierInput: PropTypes.bool,
    useFormReducer: PropTypes.bool,
};

export default React.memo(AuthorsList);
