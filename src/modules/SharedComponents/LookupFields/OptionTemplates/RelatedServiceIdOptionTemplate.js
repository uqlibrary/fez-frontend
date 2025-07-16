import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export const RelatedServiceIdOptionTemplate = ({ option: item }) => {
    return (
        <Fragment>
            <Typography variant="body1" color="textPrimary">
                {item.title}
                {!!item.status && ` (${item.status})`}
            </Typography>
        </Fragment>
    );
};

RelatedServiceIdOptionTemplate.propTypes = {
    option: PropTypes.object,
};

export default React.memo(RelatedServiceIdOptionTemplate);
