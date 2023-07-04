import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { sanitiseId } from 'helpers/general';

import { JournalFieldsMap } from './JournalFieldsMap';

const JournalsListHeaderRow = ({ checked, onChange, classes, isSelectable = true }) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell size="small" className={`${classes?.headerRow} ${classes?.actionsColumn}`}>
                    <Grid container>
                        {isSelectable && (
                            <Grid item size="small" xs={6}>
                                <Checkbox
                                    id="journal-list-header-col-1-select-all"
                                    onChange={onChange}
                                    checked={checked}
                                    label="Select All"
                                    inputProps={{
                                        'aria-label': 'Select All',
                                        'data-testid': 'journal-list-header-col-1-select-all',
                                    }}
                                    size="small"
                                />
                            </Grid>
                        )}
                    </Grid>
                </TableCell>
                <TableCell
                    size="small"
                    className={`${classes?.headerRow}`}
                    id="journal-list-header"
                    data-testid="journal-list-header"
                >
                    <Grid container className={classes?.headerContainer}>
                        {JournalFieldsMap.filter(item => item.compactView).map(header => {
                            const id = sanitiseId(`journal-list-header-${header.key}`);

                            return (
                                <Grid
                                    key={header.key}
                                    item
                                    {...header.collapsibleComponent?.sizeHeader}
                                    className={classes?.inputLabel}
                                    id={id}
                                    data-testid={id}
                                    sx={{
                                        ...(!!header.collapsibleComponent?.hiddenHeader
                                            ? header.collapsibleComponent?.hiddenHeader
                                            : /* istanbul ignore next */ {}),
                                    }}
                                >
                                    <Box display="flex" alignItems="flex-end" key={header.key}>
                                        <Typography variant="body1" className={classes?.inputLabel}>
                                            {header.label}
                                            {!!header.subLabel && (
                                                <span className={classes?.subLabel}>{header.subLabel}</span>
                                            )}
                                        </Typography>
                                        {!!header.titleHelp && (
                                            <HelpIcon {...header.titleHelp} testId={header.key} iconSize={'small'} />
                                        )}
                                    </Box>
                                </Grid>
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
