/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ChartDataProvider, ChartsSurface, ChartsText, PiePlot, ChartsTooltip } from '@mui/x-charts';

import debounce from 'debounce-promise';

const SINGLE_CHAR_WIDTH = 23;

const VisualisationWorks = ({ text, data, id, showTooltips = false }) => {
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
                        data: data,
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
                            fontSize={40}
                            fontWeight={400}
                            fontFamily="Roboto, Arial, sans-serif"
                        />
                    )}
                    {showTooltips && <ChartsTooltip trigger="item" />}
                </ChartsSurface>
            </ChartDataProvider>
        </Box>
    );
};
VisualisationWorks.propTypes = {
    text: PropTypes.string,
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            label: PropTypes.string,
            colour: PropTypes.string,
        }),
    ).isRequired,
    showTooltips: PropTypes.bool,
};

export default React.memo(VisualisationWorks);
