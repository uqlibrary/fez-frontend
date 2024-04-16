import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

const SectionTitle = ({ children, ...rest }) => {
    return (
        <Typography textTransform={'uppercase'} fontWeight={400} {...rest}>
            {children}
        </Typography>
    );
};

SectionTitle.propTypes = {
    children: PropTypes.node.isRequired,
};

export default React.memo(SectionTitle);
