import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export const IssnUlrichLinkTemplate = ({ item }) => {
    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{item.key}</span>{' '}
                {!!item.value && (
                    <a target="_blank" href={item.value}>
                        Check Ulrichs information
                    </a>
                )}
            </Typography>
        </React.Fragment>
    );
};

IssnUlrichLinkTemplate.propTypes = {
    item: PropTypes.object,
};
