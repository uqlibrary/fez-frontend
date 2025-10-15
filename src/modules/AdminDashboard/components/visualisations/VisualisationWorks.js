/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ChartDataProvider, ChartsSurface, ChartsText, PiePlot } from '@mui/x-charts';

import debounce from 'debounce-promise';

const SINGLE_CHAR_WIDTH = 29;

const VisualisationWorks = ({ text, amount, id, colour = '#B60DCE' }) => {
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
                '& .MuiPieChart-series': {
                    transform: `translate(${parentSize.width / 2}px, ${parentSize.height / 2}px)`,
                },
            }}
        >
            <ChartDataProvider
                series={[
                    {
                        data: [{ id: 0, value: amount, label: 'Unprocessed', color: colour }],
                        type: 'pie',
                        innerRadius: 60,
                        outerRadius: 80,
                        paddingAngle: 1,
                        cornerRadius: 1,
                    },
                ]}
                height={160}
                disableAxisListener
            >
                <ChartsSurface>
                    <PiePlot />
                    {text && (
                        <ChartsText
                            text={text}
                            y="60%"
                            x={Math.floor(parentSize.width / 2 - (text.length * SINGLE_CHAR_WIDTH) / 2)}
                            fontSize={50}
                            fontWeight={400}
                            fontFamily="Roboto, Arial, sans-serif"
                        />
                    )}
                </ChartsSurface>
            </ChartDataProvider>
        </Box>
    );
};
VisualisationWorks.propTypes = {
    text: PropTypes.string,
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    colour: PropTypes.string,
};

export default React.memo(VisualisationWorks);
