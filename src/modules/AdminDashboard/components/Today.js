import React from 'react';

import Box from '@mui/material/Box';

import VisualisationSystemAlerts from './visualisations/VisualisationSystemAlerts';

const Today = () => {
    return (
        <Box>
            System Alerts
            <VisualisationSystemAlerts total={150} today={25} assigned={15} />
        </Box>
    );
};

export default React.memo(Today);
