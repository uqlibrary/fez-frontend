/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow } from 'material-table';
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

export const getColumns = (suffix, classes) => {
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
                    icon={getIcon(rowData)}
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
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns(suffix, classes);

    const [data, setData] = React.useState(list);

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
            }}
            actions={[
                rowData => ({
                    icon: props => <KeyboardArrowUp {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-up`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-up`,
                    },
                    tooltip: moveUpHint,
                    disabled: rowData.tableData.id === 0,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index - 1];
                        console.log(materialTableRef.current.scrollTop);
                        setData([...data.slice(0, index - 1), rowData, nextContributor, ...data.slice(index + 1)]);
                    },
                }),
                rowData => ({
                    icon: props => <KeyboardArrowDown {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                    },
                    tooltip: moveDownHint,
                    disabled: rowData.tableData.id === data.length - 1,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index + 1];
                        setData([...data.slice(0, index), nextContributor, rowData, ...data.slice(index + 2)]);
                    },
                }),
                rowData => ({
                    icon: props => <Edit {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                    },
                    tooltip: editHint,
                    onClick: () => {},
                }),
                rowData => ({
                    icon: props => <Delete {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-delete`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-delete`,
                    },
                    tooltip: deleteHint,
                    onClick: () => {},
                }),
            ]}
            data={data}
            icons={tableIcons}
            title=""
            detailPanel={AuthorDetail}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                search: true,
                maxBodyHeight: 400,
                minBodyHeight: 200,
                pageSize: 50,
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
            }}
        />
    );
};

AuthorsList.propTypes = {
    contributorEditorId: PropTypes.string,
    list: PropTypes.array,
    locale: PropTypes.object,
};

export default React.memo(AuthorsList);
