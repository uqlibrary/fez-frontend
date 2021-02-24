import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export const GenericTemplate = ({ item }) => <Typography variant="body2">{item.value || item}</Typography>;

GenericTemplate.propTypes = {
    item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default React.memo(GenericTemplate);
