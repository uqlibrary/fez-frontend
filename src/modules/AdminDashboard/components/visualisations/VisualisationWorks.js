import React from 'react';
import PropTypes from 'prop-types';

import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ChartsText } from '@mui/x-charts/ChartsText';
import { PiePlot } from '@mui/x-charts/PieChart';

const VisualisationWorks = ({ text, amount, colour = '#B60DCE' }) => {
    return (
        <ResponsiveChartContainer
            series={[
                {
                    data: [{ id: 0, value: amount, label: 'Unprocessed', color: colour }],
                    type: 'pie',
                    innerRadius: 60,
                    outerRadius: 80,
                    paddingAngle: 1,
                    cornerRadius: 1,
                    cx: '50%',
                },
            ]}
            height={160}
        >
            <PiePlot />
            {text && (
                <ChartsText
                    text={text}
                    y="60%"
                    x={`${Math.floor(110 / (text.length < 3 ? text.length + 1 : text.length))}%`}
                    fontSize={50}
                    fontWeight={400}
                    fontFamily="Roboto, Arial, sans-serif"
                />
            )}
        </ResponsiveChartContainer>
    );
};
VisualisationWorks.propTypes = {
    text: PropTypes.string,
    amount: PropTypes.number.isRequired,
    colour: PropTypes.string,
};

export default React.memo(VisualisationWorks);
