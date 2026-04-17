import React from 'react';
import Grid from '@mui/material/GridLegacy';
import PropTypes from 'prop-types';

// import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import JournalsListHeaderRow from './partials/JournalsListHeaderRow';
import JournalsListDataRow from './partials/JournalsListDataRow';

const JournalsList = ({
    journals,
    onSelectionChange,
    onToggleSelectAll,
    selected = {},
    isSelectable = true,
    isAllSelected,
}) => {
    return (
        <Grid container spacing={0} id="journal-list" data-testid="journal-list">
            <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table
                        aria-label="collapsible table"
                        sx={{
                            '& th, & td:not[data-testid=collapsible-cell-closed]': {
                                padding: '6px',
                            },
                        }}
                    >
                        <JournalsListHeaderRow
                            checked={isAllSelected}
                            onChange={onToggleSelectAll}
                            isSelectable={isSelectable}
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
