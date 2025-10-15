/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ChartDataProvider, ChartsSurface, BarPlot } from '@mui/x-charts';

const VisualisationSystemAlerts = ({
    assigned,
    remaining,
    id = 'system-alerts',
    colours = { assigned: '#338CFA', remaining: '#B60DCE' },
}) => {
    return (
        <Box data-testid={`chart-container-${id}`} sx={{ width: 200, height: 40 }}>
            <ChartDataProvider
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
                        data: ['A', 'B'],
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
                disableAxisListener
                sx={{ '> rect': { height: '20px !important' } }}
            >
                <ChartsSurface>
                    <BarPlot />
                </ChartsSurface>
            </ChartDataProvider>
        </Box>
    );
};
// stacking bar not working, also get rid of axis scale
VisualisationSystemAlerts.propTypes = {
    id: PropTypes.string,
    assigned: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
    colours: PropTypes.shape({
        assigned: PropTypes.string.isRequired,
        remaining: PropTypes.string,
    }),
};

export default React.memo(VisualisationSystemAlerts);
