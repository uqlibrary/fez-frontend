import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PieChartContainer = ({ label, subtext, children }) => {
    return (
        <React.Fragment>
            <Typography textTransform={'uppercase'} textAlign={'center'} fontWeight={400}>
                {label}
            </Typography>
            {subtext && <Box textAlign={'center'}>{subtext}</Box>}
            <Box>{children}</Box>
        </React.Fragment>
    );
};

PieChartContainer.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    subtext: PropTypes.any,
};

export default React.memo(PieChartContainer);
