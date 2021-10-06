import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const JournalsListDataCol3 = ({ journal, index }) => {
    return (
        <Grid
            container
            spacing={0}
            id={`journal-list-fav-${index}`}
            alignItems="flex-end"
            alignContent="flex-end"
            style={{ marginTop: 0, borderBottom: '1px dashed #e6e6e6', height: 44 }}
        >
            <Grid
                key={index}
                item
                style={{
                    height: 44,
                    borderLeft: '1px dashed #e6e6e6',
                }}
            >
                <Tooltip title={`Click to add - ${journal.jnl_title} - to your favourites`} placement="left">
                    <IconButton
                        style={{ padding: 4, marginLeft: 6, marginTop: 2 }}
                        id={`journal-list-fav-button-${index}`}
                    >
                        <FavoriteBorderIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
};

JournalsListDataCol3.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(JournalsListDataCol3);
