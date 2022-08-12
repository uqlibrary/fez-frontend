import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';

const JournalsListHeaderRow = ({ isSelectable = true }) => {
    return (
        <TableHead>
            <TableRow>
                {isSelectable && (
                    <TableCell size="small">
                        <Checkbox
                            size="small"
                            id="journal-list-header-col-1-select-all"
                            data-testid="journal-list-header-col-1-select-all"
                            label="Select All"
                            inputProps={{ 'aria-label': 'Select All' }}
                        />
                    </TableCell>
                )}
                <TableCell size="small" />
                <TableCell size="small">
                    <Grid container>
                        <Grid xs={12} sm={8} item>
                            Journal title
                        </Grid>
                        <Hidden xsDown>
                            <Grid item xs={12} sm={2}>
                                Open access
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                Highest quartile
                            </Grid>
                        </Hidden>
                    </Grid>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

JournalsListHeaderRow.propTypes = {
    isSelectable: PropTypes.bool,
};
export default React.memo(JournalsListHeaderRow);
