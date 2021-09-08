import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';

const JournalsListHeaderCol2 = ({ journal, minimalView }) => {
    return (
        <Grid
            item
            key={journal.key}
            id={`journal-list-header-${journal.key}`}
            style={{ width: minimalView ? journal.compactSize : journal.size, height: 34 }}
        >
            <InputLabel shrink style={{ whiteSpace: 'normal', textOverflow: 'ellipsis', fontWeight: 600 }}>
                {journal.label}
            </InputLabel>
        </Grid>
    );
};

JournalsListHeaderCol2.propTypes = {
    journal: PropTypes.object.isRequired,
    minimalView: PropTypes.bool.isRequired,
};

export default React.memo(JournalsListHeaderCol2);
