import React from 'react';
import Grid from '@mui/material/Grid';
import { JournalFieldsMap } from './JournalFieldsMap';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    gridContainer: {
        width: '101%',
        borderBottom: '1px solid #CCC',
        marginBottom: 6,
        height: 40,
        [theme.breakpoints.up('md')]: {
            height: 32,
        },
    },
    gridItem: {
        height: 40,
        [theme.breakpoints.up('md')]: {
            height: 32,
        },
    },
    checkbox: {
        padding: 2,
        marginTop: 4,
        [theme.breakpoints.up('md')]: {
            marginTop: -8,
        },
    },
    heading: {
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            alignItems: 'center',
        },
        height: 40,
        [theme.breakpoints.up('sm')]: {
            height: 32,
        },
        paddingLeft: theme.spacing(1),
    },
    headingPadding: {
        paddingLeft: theme.spacing(2),
    },
}));

const JournalsListHeaderCol1 = ({ onChange, isSelectable = true, checked }) => {
    const classes = useStyles();

    return (
        <Grid
            container
            spacing={0}
            id="journal-list-header"
            data-testid="journal-list-header"
            alignItems="center"
            className={classes.gridContainer}
        >
            <Grid item xs="auto" id="journal-list-header-checkbox" className={classes.gridItem}>
                {isSelectable && (
                    <Tooltip title="Select All" placement="right">
                        <Checkbox
                            id="journal-list-header-col-1-select-all"
                            onChange={onChange}
                            className={classes.checkbox}
                            checked={checked}
                            label="Select All"
                            inputProps={{
                                'aria-label': 'Select All',
                                'data-testid': 'journal-list-header-col-1-select-all',
                                'data-analyticsid': 'journal-list-header-col-1-select-all',
                            }}
                        />
                    </Tooltip>
                )}
            </Grid>
            <Grid
                item
                xs
                id="journal-list-header-col-1"
                data-testid="journal-list-header-col-1"
                className={clsx({ [classes.heading]: true, [classes.headingPadding]: isSelectable })}
            >
                <InputLabel shrink style={{ fontWeight: 600 }}>
                    {JournalFieldsMap[0].label}
                </InputLabel>
            </Grid>
        </Grid>
    );
};

JournalsListHeaderCol1.propTypes = {
    isSelectable: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default React.memo(JournalsListHeaderCol1);
