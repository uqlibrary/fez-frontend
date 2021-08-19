import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';

const JournalsListHeaderCol2 = ({ journal }) => {
    return (
        <Grid item key={journal.key} id={`journal-list-header-${journal.key}`} style={{ width: journal.size }}>
            <InputLabel shrink>{journal.label}</InputLabel>
        </Grid>
    );
};

JournalsListHeaderCol2.propTypes = {
    journal: PropTypes.object.isRequired,
};

export default React.memo(JournalsListHeaderCol2);
