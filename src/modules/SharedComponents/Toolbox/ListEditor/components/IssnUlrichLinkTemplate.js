import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

export const IssnUlrichLinkTemplate = ({ item }) => {
    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                {item.key}
                {!!item.value && <Link to={item.value}>Check Ulrichs information</Link>}
            </Typography>
        </React.Fragment>
    );
};

IssnUlrichLinkTemplate.propTypes = {
    item: PropTypes.object,
};
