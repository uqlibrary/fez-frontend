import React from 'react';
import PropTypes from 'prop-types';

import { ResponsiveChartContainer, BarPlot } from '@mui/x-charts';

const VisualisationSystemAlerts = ({
    assigned,
    remaining,
    colours = { assigned: '#338CFA', remaining: '#B60DCE' },
}) => {
    return (
        <ResponsiveChartContainer
            series={[
                { data: [assigned], type: 'bar', stack: 'SystemAlerts', layout: 'horizontal' },
                {
                    data: [remaining],
                    type: 'bar',
                    stack: 'SystemAlerts',
                    layout: 'horizontal',
                },
            ]}
            height={40}
            colors={[colours.assigned, colours.remaining]}
            yAxis={[
                {
                    data: ['A', 'B', 'C'],
                    scaleType: 'band',
                    id: 'y-axis-id',
                },
            ]}
            margin={{
                left: 0,
                right: 0,
                top: 10,
                bottom: 10,
            }}
            disableAxisListener
            sx={{ '& [class$="-MuiBarElement-root"]': { height: '20px !important' } }}
        >
            <BarPlot />
        </ResponsiveChartContainer>
    );
};
// stacking bar not working, also get rid of axis scale
VisualisationSystemAlerts.propTypes = {
    assigned: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
    colours: PropTypes.shape({
        assigned: PropTypes.string.isRequired,
        remaining: PropTypes.string.isRequired,
    }),
};

export default React.memo(VisualisationSystemAlerts);
