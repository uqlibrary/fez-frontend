/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState, GaugeValueText } from '@mui/x-charts';

const GaugePointer = () => {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    /* istanbul ignore next */
    if (valueAngle === null) {
        // No value to display
        return null;
    }

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="red" />
            <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke="red" strokeWidth={3} />
        </g>
    );
};

const VisualisationOpenAccess = ({
    text,
    subText,
    amount,
    maxAmount,
    id = 'open-access',
    colourValue = '#35A9A5',
    colourReference = 'rgba(0, 0, 0, 0.12)',
}) => {
    const chartVal = maxAmount > 0 ? Math.round((amount / maxAmount) * 100) : /* istanbul ignore next */ 0;
    return (
        <Box data-testid={`chart-container-${id}`}>
            <GaugeContainer
                startAngle={-110}
                endAngle={110}
                height={160}
                value={chartVal}
                sx={{
                    '& [class$="MuiGauge-referenceArc"]': {
                        fill: colourReference,
                        '&:last-of-type': { fill: colourValue },
                    },
                }}
                title="Gauge visualisation"
                aria-label="Gauge visualisation"
            >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugePointer />
                <GaugeValueText
                    text={text}
                    y="85%"
                    fontFamily="Roboto, Helvetica, sans-serif"
                    fontSize="18"
                    fontWeight={400}
                />
                {subText && (
                    <GaugeValueText text={subText} y="96%" fontFamily="Roboto, Helvetica, sans-serif" fontSize="16" />
                )}
            </GaugeContainer>
        </Box>
    );
};
VisualisationOpenAccess.propTypes = {
    amount: PropTypes.number.isRequired,
    maxAmount: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    id: PropTypes.string,
    subText: PropTypes.string,
    colourValue: PropTypes.string,
    colourReference: PropTypes.string,
};

export default React.memo(VisualisationOpenAccess);
