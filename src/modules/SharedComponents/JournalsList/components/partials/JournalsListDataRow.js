import React from 'react';
import PropTypes from 'prop-types';
import { JournalFieldsMap } from './JournalFieldsMap';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
// import Hidden from '@material-ui/core/Hidden';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { sanitiseId } from 'helpers/general';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Box from '@material-ui/core/Box';
import { useIsMobileView } from 'hooks';
import { makeStyles } from '@material-ui/core/styles';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

import JournalsListCollapsibleDataPanel from './JournalsListCollapsibleDataPanel';

const useStyles = makeStyles(theme => ({
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
        padding: theme.spacing(1),
    },

    collapsibleContainerDataRowTop: {
        paddingTop: theme.spacing(2),
    },
    collapsibleContainerDataRowBottom: {
        paddingBottom: theme.spacing(1),
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
    mobileTitle: {
        border: 0,
    },
    headerContentMobile: {
        [theme.breakpoints.down('xs')]: {
            paddingBottom: theme.spacing(1),
        },
    },
    headerContentTitle: {
        paddingTop: theme.spacing(1),
    },
}));

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

const JournalsListDataRow = ({ row, classes, isSelectable = false, onChange, checked = false }) => {
    const [open, setOpen] = React.useState(false);
    const classesInternal = useStyles();
    const isXsDown = useIsMobileView();

    const mobileLabels = JournalFieldsMap.filter(item => item.collapsibleComponent?.mobileView || false);

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell size="small" className={classes.actionsColumn} {...(isXsDown ? { padding: 'none' } : {})}>
                    <Grid container className={classes.dataRowContainer}>
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
                    <Grid container className={classes.dataRowContainer}>
                        <Grid sm={8} item>
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
                        {isXsDown && (
                            <Grid item xs={12} className={classesInternal.headerContentMobile}>
                                <Typography variant="body1" component="div">
                                    <Box display="flex" alignItems="flex-end" key={mobileLabels?.[0].key}>
                                        <Typography variant="body1" className={classes.inputLabel} component="span">
                                            {mobileLabels?.[0].label}
                                            {!!mobileLabels?.[0].subLabel && (
                                                <span className={classes.subLabel}>{mobileLabels?.[0].subLabel}</span>
                                            )}
                                        </Typography>
                                        {!!mobileLabels?.[0].titleHelp && (
                                            <HelpIcon
                                                {...mobileLabels?.[0].titleHelp}
                                                testId={mobileLabels?.[0].key}
                                                iconSize={'small'}
                                            />
                                        )}
                                    </Box>
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={2} className={classesInternal.headerContentMobile}>
                            {row.fez_journal_doaj ? (
                                <LockOpenIcon className={classesInternal.iconClosed} />
                            ) : (
                                <LockOutlinedIcon className={classesInternal.iconOpen} />
                            )}
                        </Grid>
                        {isXsDown && (
                            <Grid item xs={12} className={classesInternal.headerContentMobile}>
                                <Typography variant="body1" component="div">
                                    <Box display="flex" alignItems="flex-end" key={mobileLabels?.[1].key}>
                                        <Typography variant="body1" className={classes.inputLabel} component="span">
                                            {mobileLabels?.[1].label}
                                            {!!mobileLabels?.[1].subLabel && (
                                                <span className={classes.subLabel}>{mobileLabels?.[1].subLabel}</span>
                                            )}
                                        </Typography>
                                        {!!mobileLabels?.[1].titleHelp && (
                                            <HelpIcon
                                                {...mobileLabels?.[1].titleHelp}
                                                testId={mobileLabels?.[1].key}
                                                iconSize={'small'}
                                            />
                                        )}
                                    </Box>
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={2} className={classesInternal.headerContentMobile}>
                            {`Q${quartileFn(row)}`}
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
            <JournalsListCollapsibleDataPanel row={row} open={open} classes={{ ...classes, ...classesInternal }} />
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
