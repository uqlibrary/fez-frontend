import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

const SectionTitle = ({ children, ...rest }) => {
    return (
        <Typography
            {...rest}
            sx={[
                {
                    fontWeight: 400,
                },
                ...(Array.isArray(rest.sx) ? rest.sx : [rest.sx]),
            ]}
        >
            {children}
        </Typography>
    );
};

SectionTitle.propTypes = {
    children: PropTypes.node.isRequired,
};

export default React.memo(SectionTitle);
