import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

import { JournalFieldsMap } from './JournalFieldsMap';

const JournalsListHeaderRow = ({ checked, onChange, classes, isSelectable = true }) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell size="small" className={`${classes.headerRow} ${classes.actionsColumn}`}>
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
                <TableCell size="small" className={`${classes.headerRow}`}>
                    <Grid container className={classes.headerContainer}>
                        {JournalFieldsMap.filter(item => item.compactView).map(header => {
                            return (
                                <React.Fragment key={header.key}>
                                    <Hidden
                                        only={
                                            !!header.collapsibleComponent.hidden && [
                                                ...header.collapsibleComponent.hidden,
                                            ]
                                        }
                                    >
                                        <Grid item {...header.collapsibleComponent.size} className={classes.inputLabel}>
                                            <Box display="flex" alignItems="flex-end" key={header.key}>
                                                <Typography variant="body1" className={classes.inputLabel}>
                                                    {header.label}
                                                    {!!header.subLabel && (
                                                        <span className={classes.subLabel}>{header.subLabel}</span>
                                                    )}
                                                </Typography>
                                                {!!header.titleHelp && (
                                                    <HelpIcon
                                                        {...header.titleHelp}
                                                        testId={header.key}
                                                        iconSize={'small'}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Hidden>
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
