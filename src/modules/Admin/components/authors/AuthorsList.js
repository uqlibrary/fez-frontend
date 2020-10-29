/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow } from 'material-table';
// import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { numberToWords } from 'config';

import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Edit from '@material-ui/icons/Edit';
import People from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import PersonOutlined from '@material-ui/icons/PersonOutlined';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Tooltip from '@material-ui/core/Tooltip';
import Lock from '@material-ui/icons/Lock';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Delete from '@material-ui/icons/Delete';

import { tableIcons } from './AuthorsListIcons';
import Typography from '@material-ui/core/Typography';
import { UqIdField } from 'modules/SharedComponents/LookupFields';

import { AFFILIATION_TYPE_NOT_UQ, ORG_TYPE_ID_UNIVERSITY } from 'config/general';
import { default as globalLocale } from 'locale/global';

export const useStyles = makeStyles(() => ({
    text: {
        fontSize: 13,
    },
    linked: {
        fontWeight: 500,
    },
}));

const getIcon = rowData => {
    if (parseInt(rowData.uqIdentifier, 10)) {
        return <HowToRegIcon color="primary" />;
    } else if (rowData.selected) {
        return <Person color="secondary" />;
    } else if ((rowData.disabled || rowData.disabled) && !rowData.enableSelect) {
        return rowData.lockedTooltip ? (
            <Tooltip title={rowData.lockedTooltip}>
                <Lock color="secondary" />
            </Tooltip>
        ) : (
            <Lock color="secondary" />
        );
    } else {
        return <PersonOutlined color="secondary" />;
    }
};

export const NameAsPublished = React.memo(({ icon, text, linked }) => {
    const classes = useStyles();
    return (
        <Grid container spacing={2}>
            <Hidden xsDown>
                <Grid item style={{ alignSelf: 'center' }}>
                    {icon}
                </Grid>
            </Hidden>
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

export const getColumns = (disabled, suffix, classes) => {
    const linkedClass = rowData => (!!rowData.aut_id ? classes.linked : '');
    return [
        {
            title: (
                <NameAsPublished
                    icon={<People color="secondary" />}
                    text={
                        <Typography variant="caption" color="secondary">
                            {"Author's name as published"}
                        </Typography>
                    }
                />
            ),
            field: 'nameAsPublished',
            render: rowData => (
                <NameAsPublished
                    icon={getIcon({ ...rowData, disabled })}
                    text={
                        <React.Fragment>
                            <Typography variant="body2" className={linkedClass(rowData)}>
                                {rowData.nameAsPublished}
                            </Typography>
                            <Typography variant="caption" className={linkedClass(rowData)}>{`${numberToWords(
                                rowData.tableData.id + 1,
                            )} ${suffix}`}</Typography>
                        </React.Fragment>
                    }
                    linked={!!rowData.aut_id}
                />
            ),
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {'UQ Identifier'}
                </Typography>
            ),
            field: 'uqIdentifier',
            render: rowData => (
                <Typography variant="body2" className={linkedClass(rowData)}>
                    {rowData.aut_id
                        ? `${rowData.aut_org_username || rowData.aut_student_username || rowData.aut_ref_num} - ${
                              rowData.aut_id
                          }`
                        : ''}
                </Typography>
            ),
            editComponent: props => {
                const { rowData: contributor } = props;
                const prefilledSearch = contributor.uqIdentifier === '0';
                if (prefilledSearch) {
                    contributor.uqUsername = contributor.nameAsPublished;
                }
                const onChange = selectedItem => {
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
                            selectedItem.aut_ref_num} - ${selectedItem.aut_id}`,
                    };
                    props.onRowDataChange({ ...contributor, ...newValue });
                };

                return (
                    <UqIdField
                        {...props}
                        // disabled={disabled}
                        hideLabel
                        hintText="Type UQ author name to search"
                        uqIdFieldId={'rek-author-aut-id'}
                        key={!!contributor.uqIdentifier ? contributor.uqIdentifier : contributor.uqUsername || 'aut-id'}
                        onChange={onChange}
                        // onClear={_onUQIdentifierCleared}
                        value={contributor.uqUsername || contributor.uqIdentifier || ''}
                        prefilledSearch={prefilledSearch}
                    />
                );
            },
            searchable: true,
        },
    ];
};

export const AuthorDetail = rowData => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">{rowData.nameAsPublished}</Typography>
                <Typography variant="caption">{`${numberToWords(rowData.tableData.id + 1)}`}</Typography>
            </Grid>
        </Grid>
    );
};

export const AuthorsList = ({
    contributorEditorId,
    disabled,
    list,
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
    onChange,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns(disabled, suffix, classes);

    const [data, setData] = React.useState(list);

    const handleAuthorUpdate = (action, newData, oldData) => {
        const newList = [...data.slice(0, oldData.tableData.id), newData, ...data.slice(oldData.tableData.id + 1)];
        setData(newList);
        onChange(newList);
    };

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => (
                    <div {...props} id={`${contributorEditorId}-list`} data-testid={`${contributorEditorId}-list`} />
                ),
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
                    disabled: disabled || rowData.tableData.id === 0,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index - 1];
                        console.log(materialTableRef.current.scrollTop);
                        const newList = [
                            ...data.slice(0, index - 1),
                            rowData,
                            nextContributor,
                            ...data.slice(index + 1),
                        ];
                        setData(newList);
                        onChange(newList);
                    },
                }),
                rowData => ({
                    icon: props => <KeyboardArrowDown {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                    },
                    tooltip: moveDownHint,
                    disabled: disabled || rowData.tableData.id === data.length - 1,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index + 1];
                        const newList = [...data.slice(0, index), nextContributor, rowData, ...data.slice(index + 2)];
                        setData(newList);
                        onChange(newList);
                    },
                }),
                rowData => ({
                    icon: props => <Edit {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                    },
                    disabled: disabled,
                    tooltip: editHint,
                    onClick: (event, rowData) => {
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
                    disabled: disabled,
                    tooltip: deleteHint,
                    onClick: () => {},
                }),
            ]}
            data={data}
            icons={tableIcons}
            title=""
            detailPanel={AuthorDetail}
            editable={{
                onRowUpdateCancelled: () => {},
            }}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                search: true,
                ...(list.length > 10 ? { maxBodyHeight: 550 } : {}),
                ...(list.length > 10 ? { paging: true } : { paging: false }),
                ...(list.length > 100 ? { pageSize: list.length > 100 ? 50 : 5 } : {}),
                pageSizeOptions: [5, 50, 100, 200, 500],
                padding: 'dense',
                rowStyle: rowData => {
                    if (!!rowData.selected) {
                        return {
                            backgroundColor: theme.palette.accent.main,
                        };
                    } else if (!!rowData.aut_id) {
                        return {
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.primary.main,
                        };
                    } else {
                        return {};
                    }
                },
                overflowY: list.length > 10 ? 'auto' : 'none',
            }}
        />
    );
};

AuthorsList.propTypes = {
    contributorEditorId: PropTypes.string,
    disabled: PropTypes.bool,
    list: PropTypes.array,
    locale: PropTypes.object,
    onChange: PropTypes.func,
};

export default React.memo(AuthorsList);
