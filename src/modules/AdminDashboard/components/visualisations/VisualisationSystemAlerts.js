/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ChartDataProvider, ChartsSurface, BarPlot } from '@mui/x-charts';

import debounce from 'debounce-promise';

const VisualisationSystemAlerts = ({
    assigned,
    remaining,
    id = 'system-alerts',
    colours = { assigned: '#338CFA', remaining: '#B60DCE' },
}) => {
    const [parentSize, setParentSize] = React.useState({ width: 0, height: 0 });
    const _parentRef = React.useRef();

    const handleResize = debounce(() => {
        setParentSize(_parentRef?.current?.getBoundingClientRect() ?? { width: 0, height: 0 });
    }, 200);

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    React.useEffect(() => {
        handleResize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            data-testid={`chart-container-${id}`}
            ref={_parentRef}
            sx={{
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
                margin={{ top: parentSize.height / 4, right: 0, bottom: 0, left: -(parentSize.width / 4) }}
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
