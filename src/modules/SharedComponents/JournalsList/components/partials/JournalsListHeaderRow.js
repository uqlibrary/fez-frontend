import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';

import { JournalFieldsMap } from './JournalFieldsMap';

const JournalsListHeaderRow = ({ checked, onChange, classes, isSelectable = true }) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell size="small" className={classes.actionsColumn}>
                    <Grid container>
                        {isSelectable && (
                            <Grid item size="small" xs={6}>
                                <Checkbox
                                    id="journal-list-header-col-1-select-all"
                                    data-testid="journal-list-header-col-1-select-all"
                                    onChange={onChange}
                                    checked={checked}
                                    label="Select All"
                                    inputProps={{ 'aria-label': 'Select All' }}
                                    size="small"
                                />
                            </Grid>
                        )}
                    </Grid>
                </TableCell>
                <TableCell size="small">
                    <Grid container>
                        {JournalFieldsMap.filter(item => item.compactView).map(header => {
                            return (
                                <React.Fragment key={header.key}>
                                    {!!header.hidden ? (
                                        <Hidden only={[...header.hidden]}>
                                            <Grid item {...header.size}>
                                                {header.label}
                                            </Grid>
                                        </Hidden>
                                    ) : (
                                        <Grid item {...header.size}>
                                            {header.label}
                                        </Grid>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Grid>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

JournalsListHeaderRow.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    classes: PropTypes.object,
    isSelectable: PropTypes.bool,
};
export default React.memo(JournalsListHeaderRow);
