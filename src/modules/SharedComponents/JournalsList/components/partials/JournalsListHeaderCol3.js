import React from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';

const JournalsListHeaderCol3 = ({ toggleView, minimalView }) => {
    const props = {
        minimalView,
    };
    return (
        <Grid
            container
            spacing={0}
            alignItems="flex-end"
            data-testid={'journal-list-header-view-toggle'}
            data-analyticsid={'journal-list-header-view-toggle'}
            sx={theme => ({
                width: '45px',
                height: '40px',
                [theme.breakpoints.up('md')]: {
                    height: '32px',
                },
                borderBottom: props.minimalView ? 'none' : '1px solid #CCC',
                marginBottom: '6px',
            })}
        >
            <Grid item xs>
                <Tooltip title={!!minimalView ? 'Show more data' : 'Show less data'}>
                    <IconButton
                        onClick={toggleView}
                        size="large"
                        sx={theme => ({
                            fontSize: '0.8rem',
                            marginLeft: '8px',
                            marginTop: '-18px',
                            [theme.breakpoints.down('lg')]: {
                                padding: 0,
                                borderRadius: 0,
                            },
                            [theme.breakpoints.up('md')]: {
                                paddingTop: '6px',
                                paddingLeft: '4px',
                                paddingRight: '4px',
                            },
                        })}
                    >
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
