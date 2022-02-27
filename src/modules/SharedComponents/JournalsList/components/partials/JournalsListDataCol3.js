import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const JournalsListDataCol3 = ({ journal, minimalView }) => {
    return (
        <Grid
            container
            spacing={0}
            id={`journal-list-fav-${journal.jnl_jid}`}
            data-testid={`journal-list-fav-${journal.jnl_jid}`}
            alignItems="flex-end"
            alignContent="flex-end"
            style={{ marginTop: 0, borderBottom: minimalView ? 'none' : '1px dashed #e6e6e6', height: 44 }}
        >
            <Grid
                key={journal.jnl_jid}
                item
                style={{
                    height: 44,
                    borderLeft: '1px dashed #e6e6e6',
                }}
            >
                &nbsp;
            </Grid>
        </Grid>
    );
};

JournalsListDataCol3.propTypes = {
    journal: PropTypes.object.isRequired,
    minimalView: PropTypes.bool.isRequired,
};

export default React.memo(JournalsListDataCol3);
