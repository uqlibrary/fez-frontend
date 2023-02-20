import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export const ColumnTitle = ({ title }) => <Typography variant="subtitle2">{title}</Typography>;

ColumnTitle.propTypes = {
    title: PropTypes.string,
};

export default React.memo(ColumnTitle);
