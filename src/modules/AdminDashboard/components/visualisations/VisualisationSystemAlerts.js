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
        <Box
            data-testid={`chart-container-${id}`}
            sx={{
                // Fill the table cell so the ribbon column can shrink at zoom/narrow widths; the bar
                // stretches horizontally only (preserveAspectRatio="none" on the surface).
                width: '100%',
                minWidth: 64,
                '& svg': {
                    display: 'block',
                    width: '100%',
                    height: 40,
                },
                '& rect': {
                    height: '20px !important',
                },
            }}
        >
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
                width={200}
                colors={[colours.assigned, colours.remaining]}
                yAxis={[
                    {
                        data: [''],
                        scaleType: 'band',
                        id: 'y-axis-id',
                    },
                ]}
                disableAxisListener
                // The viewBox is fixed at 200x40, so these are the values the old parent-size measurement settled on.
                margin={{ top: 10, right: 0, bottom: 0, left: -50 }}
            >
                <ChartsSurface preserveAspectRatio="none">
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
