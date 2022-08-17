import React from 'react';
import PropTypes from 'prop-types';
import { JournalFieldsMap } from './JournalFieldsMap';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { sanitiseId } from 'helpers/general';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    /* theme*/ () => ({
        inputLabel: {
            lineHeight: 1.3,
            whiteSpace: 'normal',
            textOverflow: 'ellipsis',
            fontWeight: 600,
        },
        subLabel: {
            display: 'block',
            fontWeight: 400,
        },
        iconClosed: {
            color: '#e5e5e5',
        },
        iconOpen: {
            color: 'orange',
        },

        collapsibleRow: {
            backgroundColor: '#F5F5F5',
        },

        collapsedCell: {
            padding: 0,
            borderBottom: 0,
        },

        expandedCell: {
            padding: '6px',
        },
    }),
);

export const quartileFn = data => {
    const quartileList = [];

    if (data.fez_journal_cite_score && data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0) {
        data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
            quartileList.push(parseInt(item.jnl_cite_score_asjc_code_quartile, 10));
        });
    }

    if (!!data.fez_journal_jcr_scie && data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.length > 0) {
        data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(item => {
            quartileList.push(parseInt(item.jnl_jcr_scie_category_quartile.replace('Q', ''), 10));
        });
    }

    if (data.fez_journal_jcr_ssci && data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0) {
        data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
            quartileList.push(parseInt(item.jnl_jcr_ssci_category_quartile.replace('Q', ''), 10));
        });
    }
    return quartileList.length > 0 ? Array.min(quartileList) : null;
};

export const CollapsibleDataPanelContent = ({ item, data }) => {
    const classesInternal = useStyles();

    return (
        <Grid xs={12} sm={6} item size="small">
            <Typography variant="body1">
                <InputLabel shrink className={classesInternal.inputLabel}>
                    {item.label}
                    <span className={classesInternal.inputLabel}>{item.subLabel}</span>
                </InputLabel>
            </Typography>
            <Typography variant="body1">
                {(data && item.prefix) || ''}
                {data || ''}
                {(data && item.suffix) || ''}
            </Typography>
        </Grid>
    );
};

CollapsibleDataPanelContent.propTypes = {
    item: PropTypes.object,
    data: PropTypes.string,
};

export const CollapsibleDataPanel = ({ row, open }) => {
    const classesInternal = useStyles();

    return (
        <TableRow className={classesInternal.collapsibleRow}>
            <TableCell
                colSpan={2}
                className={!open ? classesInternal.collapsedCell : classesInternal.expandedCell}
                data-testid={`collapsible-cell-${open ? 'open' : 'closed'}`}
                size="small"
            >
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box padding={2}>
                        <Grid container>
                            {JournalFieldsMap.slice(3).map(item => {
                                const itemData = (row && item.translateFn(row)) || '';
                                return (
                                    <React.Fragment key={`${item.key}-${row.jnl_jid}`}>
                                        <CollapsibleDataPanelContent item={item} data={itemData} />
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
CollapsibleDataPanel.propTypes = {
    row: PropTypes.object,
    open: PropTypes.bool,
};

const JournalsListDataRow = ({ row, classes, isSelectable = false, onChange, checked = false }) => {
    const [open, setOpen] = React.useState(false);
    const classesInternal = useStyles();

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell size="small" className={classes.actionsColumn}>
                    <Grid container>
                        {isSelectable && (
                            <Grid xs={6} item>
                                <Checkbox
                                    size="small"
                                    id={`journal-list-data-col-1-checkbox-${row.jnl_jid}`}
                                    data-testid={`journal-list-data-col-1-checkbox-${row.jnl_jid}`}
                                    value={row.jnl_jid}
                                    onChange={onChange}
                                    checked={checked}
                                    label={`Select ${row.jnl_title}`}
                                    inputProps={{ 'aria-label': `Select ${row.jnl_title}` }}
                                />
                            </Grid>
                        )}
                        <Grid xs={6} item>
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell size="small">
                    <Grid container>
                        <Grid xs={12} sm={8} item>
                            <Typography variant="body1" component="span">
                                <Link
                                    href={`/journal/view/${row.jnl_jid}`}
                                    title={row.jnl_title}
                                    id={sanitiseId(`${row.jnl_jid}-${row.jnl_title}`)}
                                >
                                    {row.jnl_title}
                                </Link>
                            </Typography>
                        </Grid>
                        <Hidden smUp>
                            <Grid item xs={12}>
                                Open access
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={2}>
                            {row.fez_journal_doaj ? (
                                <LockOpenIcon className={classesInternal.iconClosed} />
                            ) : (
                                <LockOutlinedIcon className={classesInternal.iconOpen} />
                            )}
                        </Grid>
                        <Hidden smUp>
                            <Grid item xs={12}>
                                Highest quartile
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={2}>
                            {`Q${quartileFn(row)}`}
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
            <CollapsibleDataPanel row={row} open={open} />
        </>
    );
};

JournalsListDataRow.propTypes = {
    row: PropTypes.object,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    isSelectable: PropTypes.bool,
    classes: PropTypes.any,
};
export default React.memo(JournalsListDataRow);
