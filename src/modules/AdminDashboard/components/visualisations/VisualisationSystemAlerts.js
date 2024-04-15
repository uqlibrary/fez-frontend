import React from 'react';
import PropTypes from 'prop-types';

import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';

const VisualisationSystemAlerts = ({
    today,
    assigned,
    remaining,
    colours = { today: '#35A9A5', assigned: '#338CFA', remaining: '#B60DCE' },
}) => {
    return (
        <ResponsiveChartContainer
            series={[
                { data: [today], type: 'bar', stack: 'SystemAlerts', layout: 'horizontal', color: colours.today },
                { data: [assigned], type: 'bar', stack: 'SystemAlerts', layout: 'horizontal', color: colours.assigned },
                {
                    data: [remaining],
                    type: 'bar',
                    stack: 'SystemAlerts',
                    layout: 'horizontal',
                    color: colours.remaining,
                },
            ]}
            height={40}
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
                top: 0,
                bottom: 0,
            }}
        >
            <BarPlot />
        </ResponsiveChartContainer>
    );
};
// stacking bar not working, also get rid of axis scale
VisualisationSystemAlerts.propTypes = {
    today: PropTypes.number.isRequired,
    assigned: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
    colours: PropTypes.shape({
        today: PropTypes.string.isRequired,
        assigned: PropTypes.string.isRequired,
        remaining: PropTypes.string.isRequired,
    }).isRequired,
};

export default React.memo(VisualisationSystemAlerts);
