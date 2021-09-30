import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SwapHorizontalCircleOutlinedIcon from '@material-ui/icons/SwapHorizontalCircleOutlined';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const JournalsListHeaderCol3 = ({ toggleView, minimalView }) => {
    return (
        <Grid
            container
            spacing={0}
            id="journal-list-header-1"
            alignItems="flex-end"
            style={{ height: 32, borderBottom: '1px solid #CCC', marginBottom: 6 }}
        >
            <Grid item xs>
                <Tooltip title={!!minimalView ? 'Show more data' : 'Show less data'}>
                    <IconButton
                        onClick={toggleView}
                        style={{ marginTop: -18, marginLeft: 8, paddingLeft: 4, paddingRight: 4 }}
                    >
                        {!minimalView ? (
                            <SwapHorizontalCircleIcon style={{ paddingBottom: 10, color: '#2377cb' }} />
                        ) : (
                            <SwapHorizontalCircleOutlinedIcon style={{ paddingBottom: 10, color: '#2377cb' }} />
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
