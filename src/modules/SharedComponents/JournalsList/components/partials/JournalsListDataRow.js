import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { JournalFieldsMap as fieldMappings } from './JournalFieldsMap';

import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { sanitiseId } from 'helpers/general';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import JournalsListCollapsibleDataPanel from './JournalsListCollapsibleDataPanel';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

const classesInternal = {
    iconClosed: {
        color: '#e5e5e5',
    },
    iconOpen: {
        color: 'orange',
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
};

const StyledTableCell = styled(TableCell, {
    shouldForwardProp: prop => !['isSelectable', 'journalFieldsMap'].includes(prop),
})(({ theme, isSelectable, journalFieldsMap }) => ({
    ...(isSelectable
        ? journalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.xs ?? /* istanbul ignore next */ {}
        : /* istanbul ignore next */ journalFieldsMap[0].collapsibleComponent.actionsCol?.xs ??
          /* istanbul ignore next */ {}),
    [theme.breakpoints.down('xs')]: { padding: 'none' },
    [theme.breakpoints.down('sm')]: {
        verticalAlign: 'top',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
    [theme.breakpoints.up('sm')]: {
        ...(isSelectable
            ? journalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.sm ?? /* istanbul ignore next */ {}
            : /* istanbul ignore next */ journalFieldsMap[0].collapsibleComponent.actionsCol?.sm ??
              /* istanbul ignore next */ {}),
    },
    [theme.breakpoints.up('md')]: {
        ...(isSelectable
            ? journalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.md ?? /* istanbul ignore next */ {}
            : /* istanbul ignore next */ journalFieldsMap[0].collapsibleComponent.actionsCol?.md ??
              /* istanbul ignore next */ {}),
    },
    [theme.breakpoints.up('lg')]: {
        ...(isSelectable
            ? journalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.lg ?? /* istanbul ignore next */ {}
            : /* istanbul ignore next */ journalFieldsMap[0].collapsibleComponent.actionsCol?.lg ??
              /* istanbul ignore next */ {}),
    },
    [theme.breakpoints.up('xl')]: {
        ...(isSelectable
            ? journalFieldsMap[0].collapsibleComponent.actionsCol?.selectable?.xl ?? /* istanbul ignore next */ {}
            : /* istanbul ignore next */ journalFieldsMap[0].collapsibleComponent.actionsCol?.xl ??
              /* istanbul ignore next */ {}),
    },
}));

const JournalsListDataRow = ({ row, index, isSelectable = false, onChange, checked = false }) => {
    const [open, setOpen] = React.useState(false);
    const journalFieldsMap = React.useMemo(() => fieldMappings(), []);

    if (!!!row || (!!row && Object.keys(row).length <= 0)) return <></>;

    const compactViewFields = journalFieldsMap.slice(1).filter(item => item.compactView || false);

    return (
        <>
            <TableRow>
                <StyledTableCell size="small" isSelectable={isSelectable} journalFieldsMap={journalFieldsMap}>
                    <Grid container sx={{ alignItems: 'center' }}>
                        {isSelectable && (
                            <Grid xs={6} item>
                                <Checkbox
                                    size="small"
                                    id={`journal-list-data-col-1-checkbox-${index}`}
                                    data-analyticsid={`journal-list-data-col-1-checkbox-${index}`}
                                    data-testid={`journal-list-data-col-1-checkbox-${index}`}
                                    value={row.jnl_jid}
                                    onChange={onChange}
                                    checked={checked}
                                    label={`Select ${row.jnl_title}`}
                                    inputProps={{ 'aria-label': `Select ${row.jnl_title}` }}
                                />
                            </Grid>
                        )}
                        <Grid xs={6} item>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                                id={`journal-list-expander-btn-${index}`}
                                data-analyticsid={`journal-list-expander-btn-${index}`}
                                data-testid={`journal-list-expander-btn-${index}`}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                </StyledTableCell>

                <TableCell size="small">
                    <Grid
                        container
                        sx={{ alignItems: 'center' }}
                        id={`journal-list-data-col-1-${index}`}
                        data-testid={`journal-list-data-col-1-${index}`}
                    >
                        <Grid
                            sm={7}
                            item
                            id={`journal-list-data-col-1-title-${index}`}
                            data-testid={`journal-list-data-col-1-title-${index}`}
                        >
                            <Typography variant="body1" component="span">
                                <ExternalLink
                                    href={`/journal/view/${row.jnl_jid}`}
                                    title={row.jnl_title}
                                    id={sanitiseId(`${row.jnl_jid}-${row.jnl_title}`)}
                                    sx={{
                                        '& svg': {
                                            float: 'none',
                                        },
                                    }}
                                    inline
                                >
                                    {row.jnl_title}
                                </ExternalLink>
                            </Typography>
                        </Grid>
                        {compactViewFields.map((field, fieldIndex) => {
                            const itemData =
                                (row && field.translateFn(row, classesInternal, index)) ||
                                /* istanbul ignore next */ '';
                            return (
                                <React.Fragment key={`${field.key}_${index}`}>
                                    <Grid
                                        item
                                        {...field.collapsibleComponent?.sizeHeader}
                                        sx={theme => ({
                                            ...(!!field.collapsibleComponent?.hiddenData
                                                ? field.collapsibleComponent?.hiddenData
                                                : /* istanbul ignore next */ {}),
                                            [theme.breakpoints.down('sm')]: {
                                                paddingBottom: theme.spacing(1),
                                            },
                                        })}
                                    >
                                        {field.collapsibleComponent?.translateFn(field, index, classesInternal)}
                                    </Grid>
                                    <Grid
                                        item
                                        {...field.collapsibleComponent?.sizeData}
                                        sx={theme => ({
                                            [theme.breakpoints.down('sm')]: {
                                                paddingBottom: theme.spacing(1),
                                            },
                                        })}
                                    >
                                        <Tooltip
                                            title={
                                                (itemData &&
                                                    field.showTooltip &&
                                                    field.toolTipLabel &&
                                                    field.toolTipLabel(row)) ||
                                                (field.showTooltip && /* istanbul ignore next */ itemData) ||
                                                ''
                                            }
                                            describeChild
                                            placement="left"
                                            disableFocusListener={!field.showTooltip || !itemData}
                                            disableHoverListener={!field.showTooltip || !itemData}
                                            disableTouchListener={!field.showTooltip || !itemData}
                                        >
                                            <Typography
                                                variant="body1"
                                                id={`journal-list-data-col-1-data-${index}-${fieldIndex}`}
                                                data-testid={`journal-list-data-col-1-data-${index}-${fieldIndex}`}
                                                component={'div'}
                                            >
                                                {(itemData && field.prefix) || ''}
                                                {itemData || /* istanbul ignore next */ ''}
                                                {(itemData && field.suffix) || ''}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                </React.Fragment>
                            );
                        })}
                    </Grid>
                </TableCell>
            </TableRow>
            <JournalsListCollapsibleDataPanel row={row} open={open} index={index} />
        </>
    );
};

JournalsListDataRow.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    isSelectable: PropTypes.bool,
};
export default React.memo(JournalsListDataRow);
