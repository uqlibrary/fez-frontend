import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
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
            <Tooltip title={!!minimalView ? 'Show more data' : 'Show less data'}>
                <IconButton onClick={toggleView} style={{ marginTop: -6, marginLeft: 8, padding: 4 }}>
                    {!minimalView ? (
                        <PlaylistAddCheckIcon style={{ color: '#CCC' }} />
                    ) : (
                        <PlaylistAddIcon style={{ color: '#CCC' }} />
                    )}
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

JournalsListHeaderCol3.propTypes = {
    toggleView: PropTypes.func.isRequired,
    minimalView: PropTypes.bool.isRequired,
};

export default React.memo(JournalsListHeaderCol3);
