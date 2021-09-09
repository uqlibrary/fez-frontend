import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';

const JournalsListHeaderCol2Min = ({ journal }) => {
    return (
        <Grid
            item
            key={journal.key}
            id={`journal-list-header-${journal.key}`}
            xs={journal.compactSize}
            style={{ height: 34 }}
        >
            <InputLabel shrink style={{ whiteSpace: 'normal', textOverflow: 'ellipsis', fontWeight: 600 }}>
                {journal.label}
            </InputLabel>
        </Grid>
    );
};

JournalsListHeaderCol2Min.propTypes = {
    journal: PropTypes.object.isRequired,
};

export default React.memo(JournalsListHeaderCol2Min);
