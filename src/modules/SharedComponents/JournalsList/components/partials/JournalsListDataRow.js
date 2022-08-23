import React from 'react';
import PropTypes from 'prop-types';
import { JournalFieldsMap } from './JournalFieldsMap';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { sanitiseId } from 'helpers/general';
import Typography from '@material-ui/core/Typography';
import { useIsMobileView } from 'hooks';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import JournalsListCollapsibleDataPanel from './JournalsListCollapsibleDataPanel';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

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
    externalLink: {
        '& svg': {
            float: 'none',
        },
    },
}));

const JournalsListDataRow = ({ row, index, classes, isSelectable = false, onChange, checked = false }) => {
    const [open, setOpen] = React.useState(false);
    const classesInternal = useStyles();
    const isXsDown = useIsMobileView();

    if (!!!row || (!!row && Object.keys(row).length <= 0)) return <></>;

    const compactViewFields = JournalFieldsMap.slice(1).filter(item => item.compactView || false);

    return (
        <>
            <TableRow className={classes?.root}>
                <TableCell size="small" className={classes?.actionsColumn} {...(isXsDown ? { padding: 'none' } : {})}>
                    <Grid container className={classes?.dataRowContainer}>
                        {isSelectable && (
                            <Grid xs={6} item>
                                <Checkbox
                                    size="small"
                                    id={`journal-list-data-col-1-checkbox-${index}`}
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
                                data-testid={`journal-list-expander-btn-${index}`}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                </TableCell>

                <TableCell size="small">
                    <Grid
                        container
                        className={classes?.dataRowContainer}
                        id={`journal-list-data-col-1-${index}`}
                        data-testid={`journal-list-data-col-1-${index}`}
                    >
                        <Grid
                            sm={8}
                            item
                            id={`journal-list-data-col-1-title-${index}`}
                            data-testid={`journal-list-data-col-1-title-${index}`}
                        >
                            <Typography variant="body1" component="span">
                                <ExternalLink
                                    href={`/journal/view/${row.jnl_jid}`}
                                    title={row.jnl_title}
                                    id={sanitiseId(`${row.jnl_jid}-${row.jnl_title}`)}
                                    className={classesInternal.externalLink}
                                    inline
                                >
                                    {row.jnl_title}
                                </ExternalLink>
                            </Typography>
                        </Grid>
                        {compactViewFields.map((field, fieldIndex) => {
                            const itemData =
                                (row && field.translateFn(row, classesInternal)) || /* istanbul ignore next */ '';
                            return (
                                <React.Fragment key={field.key}>
                                    <Hidden
                                        {...(!!field.collapsibleComponent?.hiddenData
                                            ? { only: [...field.collapsibleComponent?.hiddenData] }
                                            : /* istanbul ignore next */ {})}
                                    >
                                        <Grid
                                            item
                                            {...field.collapsibleComponent?.sizeHeader}
                                            className={classes?.headerContentMobile}
                                        >
                                            {field.collapsibleComponent?.translateFn(field, index, {
                                                ...classes,
                                                ...classesInternal,
                                            })}
                                        </Grid>
                                    </Hidden>
                                    <Grid
                                        item
                                        {...field.collapsibleComponent?.sizeData}
                                        className={classesInternal.headerContentMobile}
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
                                            placement="left"
                                            disableFocusListener={!field.showTooltip || !itemData}
                                            disableHoverListener={!field.showTooltip || !itemData}
                                            disableTouchListener={!field.showTooltip || !itemData}
                                        >
                                            <Typography
                                                variant="body1"
                                                id={`journal-list-data-col-1-data-${index}-${fieldIndex}`}
                                                data-testid={`journal-list-data-col-1-data-${index}-${fieldIndex}`}
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
            <JournalsListCollapsibleDataPanel
                row={row}
                open={open}
                index={index}
                classes={{ ...classes, ...classesInternal }}
            />
        </>
    );
};

JournalsListDataRow.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    isSelectable: PropTypes.bool,
    classes: PropTypes.any,
};
export default React.memo(JournalsListDataRow);
