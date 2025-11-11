import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/GridLegacy';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { sanitiseId } from 'helpers/general';

import JournalFieldsMap from './JournalFieldsMap';

const StyledTableCell = styled(TableCell, {
    shouldForwardProp: prop => !['isSelectable'].includes(prop),
})(({ theme, isSelectable }) => ({
    borderBottomWidth: '2px',
    ...(isSelectable
        ? (JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.xs ?? /* istanbul ignore next */ {})
        : /* istanbul ignore next */ (JournalFieldsMap[0].collapsibleComponent.actionsCol?.xs ??
          /* istanbul ignore next */ {})),
    [theme.breakpoints.down('sm')]: {
        verticalAlign: 'top',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
    [theme.breakpoints.up('sm')]: {
        ...(isSelectable
            ? (JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.sm ?? /* istanbul ignore next */ {})
            : /* istanbul ignore next */ (JournalFieldsMap[0].collapsibleComponent.actionsCol?.sm ??
              /* istanbul ignore next */ {})),
    },
    [theme.breakpoints.up('md')]: {
        ...(isSelectable
            ? (JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.md ?? /* istanbul ignore next */ {})
            : /* istanbul ignore next */ (JournalFieldsMap[0].collapsibleComponent.actionsCol?.md ??
              /* istanbul ignore next */ {})),
    },
    [theme.breakpoints.up('lg')]: {
        ...(isSelectable
            ? (JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.lg ?? /* istanbul ignore next */ {})
            : /* istanbul ignore next */ (JournalFieldsMap[0].collapsibleComponent.actionsCol?.lg ??
              /* istanbul ignore next */ {})),
    },
    [theme.breakpoints.up('xl')]: {
        ...(isSelectable
            ? (JournalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.xl ?? /* istanbul ignore next */ {})
            : /* istanbul ignore next */ (JournalFieldsMap[0].collapsibleComponent.actionsCol?.xl ??
              /* istanbul ignore next */ {})),
    },
}));
const classes = {
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
};

const JournalsListHeaderRow = ({ checked, onChange, isSelectable = true }) => {
    return (
        <TableHead>
            <TableRow>
                <StyledTableCell size="small" isSelectable={isSelectable}>
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
                                        'data-analyticsid': 'journal-list-header-col-1-select-all',
                                    }}
                                    size="small"
                                />
                            </Grid>
                        )}
                    </Grid>
                </StyledTableCell>
                <TableCell
                    size="small"
                    sx={{ borderBottomWidth: '2px' }}
                    id="journal-list-header"
                    data-testid="journal-list-header"
                >
                    <Grid container sx={{ alignItems: 'flex-end' }}>
                        {JournalFieldsMap.filter(item => item.compactView).map((header, index) => {
                            const id = sanitiseId(`journal-list-header-${header.key}`);

                            return (
                                <Grid
                                    key={`${header.key}_${index}`}
                                    item
                                    {...header.collapsibleComponent?.sizeHeader}
                                    id={id}
                                    data-testid={id}
                                    sx={{
                                        ...(!!header.collapsibleComponent?.hiddenHeader
                                            ? header.collapsibleComponent?.hiddenHeader
                                            : /* istanbul ignore next */ {}),
                                        ...classes.inputLabel,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ ...classes.inputLabel }}>
                                            {header.label}
                                            {!!header.subLabel && (
                                                <Box component={'span'} sx={{ display: 'block', fontWeight: 400 }}>
                                                    {header.subLabel}
                                                    {!!header.titleHelp && (
                                                        <HelpIcon
                                                            {...header.titleHelp}
                                                            testId={header.key}
                                                            iconSize={'small'}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </Typography>
                                        {!!!header.subLabel && !!header.titleHelp && (
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
