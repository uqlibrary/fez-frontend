import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';

const JournalsListHeaderCol2Full = ({ journal }) => {
    return (
        <Grid
            item
            key={journal.key}
            id={`journal-list-header-${journal.key}`}
            style={{ width: journal.size, height: 34 }}
        >
            <InputLabel
                shrink
                style={{ lineHeight: 1.3, whiteSpace: 'normal', textOverflow: 'ellipsis', fontWeight: 600 }}
            >
                {journal.label}
                <span style={{ display: 'block', fontWeight: 400 }}>{journal.subLabel}</span>
            </InputLabel>
        </Grid>
    );
};

JournalsListHeaderCol2Full.propTypes = {
    journal: PropTypes.object.isRequired,
};

export default React.memo(JournalsListHeaderCol2Full);
