import React from 'react';
import PropTypes from 'prop-types';

import { BarChart } from '@mui/x-charts/BarChart';

const VisualisationSystemAlerts = ({ total, today, assigned }) => {
    return (
        <BarChart
            series={[
                { data: [today], stack: 'New today' },
                { data: [assigned], stack: 'Assigned' },
                { data: [total - assigned], stack: 'Unassigned' },
            ]}
            layout="horizontal"
            width={320}
            height={150}
        />
    );
};
// stacking bar not working, also get rid of axis scale
VisualisationSystemAlerts.propTypes = {
    total: PropTypes.number.isRequired,
    today: PropTypes.number.isRequired,
    assigned: PropTypes.number.isRequired,
};

export default React.memo(VisualisationSystemAlerts);
