import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const JournalsListHeaderCol2 = ({ journal, minimalView }) => {
    return (
        <Grid
            item
            key={journal.key}
            id={`journal-list-header-${journal.key}`}
            style={{ width: minimalView ? journal.compactSize : journal.size }}
        >
            <Tooltip title={journal.label} placement={'top'}>
                <InputLabel shrink>{journal.label}</InputLabel>
            </Tooltip>
        </Grid>
    );
};

JournalsListHeaderCol2.propTypes = {
    journal: PropTypes.object.isRequired,
    minimalView: PropTypes.bool.isRequired,
};

export default React.memo(JournalsListHeaderCol2);
