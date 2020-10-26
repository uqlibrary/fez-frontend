/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableAction } from 'material-table';
// import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

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
}));

export const getColumns = () => {
    return [
        {
            title: (
                <Hidden xsDown>
                    <People />
                </Hidden>
            ),
            field: 'author_status',
            editable: 'never',
            render: rowData => {
                if (parseInt(rowData.uqIdentifier, 10)) {
                    return <HowToRegIcon />;
                } else if (rowData.selected) {
                    return <Person />;
                } else if ((rowData.disabled || rowData.disabled) && !rowData.enableSelect) {
                    return rowData.lockedTooltip ? (
                        <Tooltip title={rowData.lockedTooltip}>
                            <Lock />
                        </Tooltip>
                    ) : (
                        <Lock />
                    );
                } else {
                    return <PersonOutlined />;
                }
            },
        },
        {
            title: "Author's name as published",
            field: 'nameAsPublished',
        },
    ];
};

import { numberToWords } from 'config';
export const AuthorDetail = rowData => {
    console.log(rowData);
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">{rowData.nameAsPublished}</Typography>
                <Typography variant="caption">{`${numberToWords(rowData.tableData.id + 1)}`}</Typography>
            </Grid>
        </Grid>
    );
};

export const AuthorsList = ({ list, contributorEditorId }) => {
    const classes = useStyles();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns(classes);

    const [data] = React.useState(list);

    console.log('test');
    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => <div {...props} />,
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        className={classes.text}
                        id={`${contributorEditorId}-list-row-${props.index}`}
                        data-testid={`${contributorEditorId}-list-row-${props.index}`}
                    />
                ),
                Action: props => {
                    const { icon: Icon, tooltip, ...restAction } =
                        (typeof props.action === 'function' && props.action(props.data)) || props.action;
                    return (
                        <MTableAction
                            {...props}
                            action={{
                                ...restAction,
                                tooltip,
                                icon: () => (
                                    <Icon
                                        data-testid={`${contributorEditorId}-list-row-${
                                            props.data.tableData.id
                                        }-${tooltip.replace(/ /g, '-').toLowerCase()}`}
                                    >
                                        {props.action.icon}
                                    </Icon>
                                ),
                            }}
                        />
                    );
                },
            }}
            actions={[
                {
                    icon: KeyboardArrowUp,
                    tooltip: 'Move up',
                    onClick: () => {},
                },
                {
                    icon: KeyboardArrowDown,
                    tooltip: 'Move down',
                    onClick: () => {},
                },
                {
                    icon: Edit,
                    iconProps: {
                        id: 'testing',
                    },
                    tooltip: 'Edit',
                    onClick: () => {},
                },
                {
                    icon: Delete,
                    tooltip: 'Delete',
                    onClick: () => {},
                },
            ]}
            data={data}
            icons={tableIcons}
            title="Testing"
            detailPanel={AuthorDetail}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                search: true,
                maxBodyHeight: 400,
                pageSizeOptions: [50, 100, 200, 500],
            }}
        />
    );
};

AuthorsList.propTypes = {
    contributorEditorId: PropTypes.string,
    list: PropTypes.array,
};

export default React.memo(AuthorsList);
