import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import SectionTitle from './SectionTitle';

const GaugeChartContainer = ({ label, subtext, id, children }) => {
    return (
        <React.Fragment>
            <SectionTitle textAlign={'center'} data-testid={`${id}-title`}>
                {label}
            </SectionTitle>
            {subtext && (
                <SectionTitle textAlign={'center'} textTransform="none" data-testid={`${id}-subtitle`}>
                    {subtext}
                </SectionTitle>
            )}
            <Box>{children}</Box>
        </React.Fragment>
    );
};

GaugeChartContainer.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    subtext: PropTypes.any,
};

export default React.memo(GaugeChartContainer);
