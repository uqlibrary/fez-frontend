import React from 'react';
import Grid from '@material-ui/core/Grid';
import { JournalFieldsMap } from './JournalFieldsMap';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    gridContainer: {
        width: '101%',
        borderBottom: '1px solid #CCC',
        marginBottom: 6,
        height: 40,
        [theme.breakpoints.up('sm')]: {
            height: 32,
        },
    },
    gridItem: {
        height: 40,
        [theme.breakpoints.up('sm')]: {
            height: 32,
        },
    },
    checkbox: {
        padding: 2,
        marginTop: 4,
        [theme.breakpoints.up('sm')]: {
            marginTop: -8,
        },
    },
    heading: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            alignItems: 'center',
        },
        height: 40,
        [theme.breakpoints.up('sm')]: {
            height: 32,
        },
        paddingLeft: 14,
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
                            data-testid="journal-list-header-col-1-select-all"
                            onChange={onChange}
                            className={classes.checkbox}
                            checked={checked}
                            label="Select All"
                            inputProps={{ 'aria-label': 'Select All' }}
                        />
                    </Tooltip>
                )}
            </Grid>
            <Grid
                item
                xs
                id="journal-list-header-col-1"
                data-testid="journal-list-header-col-1"
                className={classes.heading}
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
