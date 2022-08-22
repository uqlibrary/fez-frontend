/* eslint-disable react/prop-types */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { JournalFieldsMap } from './partials/JournalFieldsMap';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

// import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import JournalsListHeaderRow from './partials/JournalsListHeaderRow';
import JournalsListDataRow from './partials/JournalsListDataRow';

const useStyles = makeStyles(theme => ({
    journalList: {
        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '80% auto 50px',
            flexWrap: 'nowrap',
            overflowX: 'scroll',
        },
        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: 'auto auto 50px',
        },
    },
    /* istanbul ignore next */
    actionsColumn: isSelectable => ({
        ...(isSelectable
            ? JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.xs ?? {}
            : JournalFieldsMap[0].collapsibleComponent.actionsCol?.xs ?? {}),
        [theme.breakpoints.down('xs')]: {
            verticalAlign: 'top',
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
        },
        [theme.breakpoints.up('sm')]: {
            ...(isSelectable
                ? JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.sm ?? {}
                : JournalFieldsMap[0].collapsibleComponent.actionsCol?.sm ?? {}),
        },
        [theme.breakpoints.up('md')]: {
            ...(isSelectable
                ? JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.md ?? {}
                : JournalFieldsMap[0].collapsibleComponent.actionsCol?.md ?? {}),
        },
        [theme.breakpoints.up('lg')]: {
            ...(isSelectable
                ? JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.lg ?? {}
                : JournalFieldsMap[0].collapsibleComponent.actionsCol?.lg ?? {}),
        },
        [theme.breakpoints.up('xl')]: {
            ...(isSelectable
                ? JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.xl ?? {}
                : JournalFieldsMap[0].collapsibleComponent.actionsCol?.xl ?? {}),
        },
    }),
    headerRow: {
        borderBottomWidth: '2px',
    },

    resultsTable: {
        '& th, & td:not[data-testid=collapsible-cell-closed]': {
            padding: '6px',
        },
    },
    headerContainer: {
        alignItems: 'flex-end',
    },
    dataRowContainer: {
        alignItems: 'center',
    },
    inputLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 0,
        overflow: 'hidden',
        fontSize: '0.75rem',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.1,
        whiteSpace: 'normal',
        textOverflow: 'ellipsis',
        fontWeight: 600,
    },
    subLabel: {
        display: 'block',
        fontWeight: 400,
    },
}));

const JournalsList = ({
    journals,
    onSelectionChange,
    onToggleSelectAll,
    selected = {},
    isSelectable = true,
    isAllSelected,
}) => {
    const classes = useStyles(isSelectable);

    return (
        <Grid container spacing={0} id="journal-list" data-testid="journal-list">
            <Grid item xs={12}>
                <TableContainer
                    component={Paper}
                    style={{ boxShadow: 'none' }}
                    className={classes.resultsTableContainer}
                >
                    <Table aria-label="collapsible table" className={classes.resultsTable}>
                        <JournalsListHeaderRow
                            checked={isAllSelected}
                            onChange={onToggleSelectAll}
                            isSelectable={isSelectable}
                            classes={classes}
                        />
                        <TableBody>
                            {journals &&
                                journals.length > 0 &&
                                journals.map((row, index) => (
                                    <JournalsListDataRow
                                        key={row.jnl_jid}
                                        row={row}
                                        index={index}
                                        onChange={onSelectionChange}
                                        checked={selected[row.jnl_jid]}
                                        isSelectable={isSelectable}
                                        classes={classes}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

JournalsList.propTypes = {
    journals: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func,
    onToggleSelectAll: PropTypes.func,
    selected: PropTypes.object,
    isSelectable: PropTypes.bool,
    isAllSelected: PropTypes.bool,
};

export default React.memo(JournalsList);
