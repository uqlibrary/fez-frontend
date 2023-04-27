import React from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    gridContainer: {
        width: 45,
        height: 40,
        [theme.breakpoints.up('md')]: {
            height: 32,
        },
        borderBottom: props => (props.minimalView ? 'none' : '1px solid #CCC'),
        marginBottom: 6,
    },
    toggleButton: {
        fontSize: '0.8rem',
        marginLeft: 8,
        marginTop: -18,
        [theme.breakpoints.down('lg')]: {
            padding: 0,
            borderRadius: 0,
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: 6,
            paddingLeft: 4,
            paddingRight: 4,
        },
    },
}));

const JournalsListHeaderCol3 = ({ toggleView, minimalView }) => {
    const props = {
        minimalView,
    };
    const classes = useStyles(props);

    return (
        <Grid
            container
            spacing={0}
            alignItems="flex-end"
            data-testid={'journal-list-header-view-toggle'}
            data-analyticsid={'journal-list-header-view-toggle'}
            className={classes.gridContainer}
        >
            <Grid item xs>
                <Tooltip title={!!minimalView ? 'Show more data' : 'Show less data'}>
                    <IconButton onClick={toggleView} className={classes.toggleButton} size="large">
                        {!minimalView ? (
                            <SwapHorizontalCircleOutlinedIcon style={{ paddingBottom: 10, color: '#2377cb' }} />
                        ) : (
                            <SwapHorizontalCircleIcon style={{ paddingBottom: 10, color: '#2377cb' }} />
                        )}
                        <div style={{ fontSize: '0.8rem', marginTop: 17, marginLeft: -23, paddingTop: 6 }}>
                            {!!minimalView ? 'more' : 'less'}
                        </div>
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
};

JournalsListHeaderCol3.propTypes = {
    toggleView: PropTypes.func.isRequired,
    minimalView: PropTypes.bool.isRequired,
};

export default React.memo(JournalsListHeaderCol3);
