import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export const ColumnTitle = ({ title }) => <Typography variant="subtitle2">{title}</Typography>;

ColumnTitle.propTypes = {
    title: PropTypes.string,
};

export default React.memo(ColumnTitle);
