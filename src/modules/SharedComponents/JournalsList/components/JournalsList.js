/* eslint-disable react/prop-types */
import React from 'react';
import Grid from '@material-ui/core/Grid';
// import JournalsListHeaderCol1 from './partials/JournalsListHeaderCol1';
// import JournalsListHeaderCol2Full from './partials/JournalsListHeaderCol2Full';
// import JournalsListHeaderCol2Min from './partials/JournalsListHeaderCol2Min';
// import JournalsListDataCol1 from './partials/JournalsListDataCol1';
// import JournalsListDataCol2Full from './partials/JournalsListDataCol2Full';
// import JournalsListDataCol2Min from './partials/JournalsListDataCol2Min';
import { JournalFieldsMap } from './partials/JournalFieldsMap';
// import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
// import JournalsListDataCol3 from './partials/JournalsListDataCol3';
// import JournalsListHeaderCol3 from './partials/JournalsListHeaderCol3';
import { makeStyles } from '@material-ui/core/styles';

// import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import { sanitiseId } from 'helpers/general';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import InputLabel from '@material-ui/core/InputLabel';
import JournalsListHeaderRow from './partials/JournalsListHeaderRow';

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
    titleColumn: {
        width: JournalFieldsMap[0].size.xs,
        [theme.breakpoints.up('sm')]: {
            width: JournalFieldsMap[0].size.sm,
        },
        [theme.breakpoints.up('md')]: {
            width: JournalFieldsMap[0].size.md,
        },
        [theme.breakpoints.up('lg')]: {
            width: JournalFieldsMap[0].size.lg,
        },
        [theme.breakpoints.up('xl')]: {
            width: JournalFieldsMap[0].size.xl,
        },
    },
    moreColumnsWidth: {
        marginLeft: 4,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            overflow: 'unset',
        },
        [theme.breakpoints.up('md')]: {
            overflow: props => (props.minimalView ? 'unset' : 'auto hidden'),
        },
        flexGrow: props => (props.minimalView ? 'inherit' : 1),
    },
    headerRow: {
        borderBottom: '1px solid #CCC',
        width: '100%',
        overflowY: 'hidden',
        height: 40,
        [theme.breakpoints.up('md')]: {
            height: 32,
        },
    },

    resultsTable: {
        '& th, & td': {
            padding: '6px',
        },
    },

    collapsedCell: {
        backgroundColor: '#F5F5F5',
        '& td': {
            paddingBottom: 0,
            paddingTop: 0,
        },
    },
}));

const JournalsList = ({
    journals,
    // onSelectionChange,
    // onToggleSelectAll,
    // selected = {},
    isSelectable = true,
    // isAllSelected,
}) => {
    // React.useEffect(() => {
    //     if (!Cookies.get('minimalView')) {
    //         Cookies.set('minimalView', true);
    //     }
    // }, []);

    // const [minimalView, setMinimalView] = React.useState(Cookies.get('minimalView') !== 'false');
    // const toggleView = () => {
    //     Cookies.set('minimalView', !minimalView);
    //     setMinimalView(!minimalView);
    // };
    // let colWidth = 0;
    // if (!minimalView) {
    //     for (let i = 0; i < JournalFieldsMap.length - 1; i++) {
    //         colWidth += JournalFieldsMap[i + 1].size;
    //     }
    // } else {
    //     for (let i = 0; i < JournalFieldsMap.filter(item => item.compactView).length - 1; i++) {
    //         colWidth += JournalFieldsMap.filter(item => item.compactView)[i + 1].size;
    //     }
    // }

    const props = {
        //    minimalView,
    };
    const classes = useStyles(props);

    const quartileFn = data => {
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

    const Row = props => {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <>
                <TableRow className={classes.root} size={'small'}>
                    {isSelectable && (
                        <TableCell size="small">
                            <Checkbox
                                size="small"
                                id={`journal-list-data-col-1-checkbox-${row.jnl_jid}`}
                                data-testid={`journal-list-data-col-1-checkbox-${row.jnl_jid}`}
                                value={row.jnl_jid}
                                label={`Select ${row.jnl_title}`}
                                inputProps={{ 'aria-label': `Select ${row.jnl_title}` }}
                            />
                        </TableCell>
                    )}
                    <TableCell size="small">
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell size="small" component="th" scope="row">
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
                                    <LockOpenIcon style={{ color: 'orange' }} />
                                ) : (
                                    <LockOutlinedIcon style={{ color: '#e5e5e5' }} />
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
                <TableRow className={classes.collapsedCell}>
                    <TableCell colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box padding={2}>
                                <Grid container>
                                    {JournalFieldsMap.slice(3).map(item => {
                                        const itemData = (row && item.translateFn(row)) || '';
                                        return (
                                            <Grid xs={12} sm={6} key={`${item.key}-${row.jnl_jid}`} item>
                                                <Typography variant="body1">
                                                    <InputLabel
                                                        shrink
                                                        style={{
                                                            lineHeight: 1.3,
                                                            whiteSpace: 'normal',
                                                            textOverflow: 'ellipsis',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {item.label}
                                                        <span style={{ display: 'block', fontWeight: 400 }}>
                                                            {item.subLabel}
                                                        </span>
                                                    </InputLabel>
                                                </Typography>
                                                <Typography variant="body1">
                                                    {(itemData && item.prefix) || ''}
                                                    {itemData || ''}
                                                    {(itemData && item.suffix) || ''}
                                                </Typography>
                                                <br />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <Grid container spacing={0} id="journal-list" data-testid="journal-list">
            <Grid item xs={12}>
                <TableContainer
                    component={Paper}
                    style={{ boxShadow: 'none' }}
                    className={classes.resultsTableContainer}
                >
                    <Table aria-label="collapsible table" className={classes.resultsTable}>
                        <JournalsListHeaderRow isSelectable={isSelectable} />
                        <TableBody>
                            {journals &&
                                journals.length > 0 &&
                                journals.map(row => {
                                    return <Row key={row.jnl_jid} row={row} />;
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
    /*
        <Grid
            container
            spacing={0}
            id="journal-list"
            data-testid="journal-list"
            alignItems="stretch"
            className={classes.journalList}
        >
            <Grid item className={classes.titleColumn}>
                // header
                <JournalsListHeaderCol1
                    isSelectable={isSelectable}
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                />
                // data
                {journals &&
                    journals.length > 0 &&
                    journals.map((item, index) => {
                        return (
                            <JournalsListDataCol1
                                key={index}
                                index={index}
                                journal={item}
                                onChange={onSelectionChange}
                                checked={selected[item.jnl_jid]}
                                isSelectable={isSelectable}
                            />
                        );
                    })}
            </Grid>
            <Grid item xs className={classes.moreColumnsWidth}>
                <div style={{ width: colWidth, paddingBottom: !minimalView ? 4 : 0 }}>
                    <Grid container spacing={0} alignItems="flex-end" className={classes.headerRow}>
                        // header
                        {!minimalView
                            ? JournalFieldsMap.slice(1).map((item, index) => {
                                  return <JournalsListHeaderCol2Full journal={item} index={index} key={index} />;
                              })
                            : JournalFieldsMap.slice(1)
                                  .filter(item => !!item.compactView)
                                  .map((item, index) => {
                                      return <JournalsListHeaderCol2Min journal={item} index={index} key={index} />;
                                  })}
                    </Grid>
                    // data
                    <Grid container spacing={0} alignItems="center">
                        <Grid item xs={12} style={{ marginTop: 6 }}>
                            {journals &&
                                journals.length > 0 &&
                                journals.map((item, index) => {
                                    return !minimalView ? (
                                        <JournalsListDataCol2Full key={index} index={index} journal={item} />
                                    ) : (
                                        <JournalsListDataCol2Min key={index} index={index} journal={item} />
                                    );
                                })}
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            <Grid item xs={'auto'}>
                // header
                <JournalsListHeaderCol3 toggleView={toggleView} minimalView={!!minimalView} />
                // data
                {journals &&
                    journals.length > 0 &&
                    journals.map((item, index) => {
                        return <JournalsListDataCol3 key={index} journal={item} minimalView={minimalView} />;
                    })}
            </Grid>
        </Grid>
    );*/
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
