import React from 'react';
import PropTypes from 'prop-types';

import { ResponsiveChartContainer, ChartsText, PiePlot } from '@mui/x-charts';

import debounce from 'debounce-promise';

const SINGLE_CHAR_WIDTH = 29;
const MAX_ELEMENT_WIDTH = 214;

const VisualisationWorks = ({ text, amount, colour = '#B60DCE' }) => {
    const [elementWidth, setElementWidth] = React.useState(0);
    const _ref = React.useRef();

    const handleResize = debounce(() => {
        setElementWidth(_ref?.current?.getBoundingClientRect()?.width ?? MAX_ELEMENT_WIDTH);
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
            ref={_ref}
            disableAxisListener
        >
            <PiePlot />
            {text && (
                <ChartsText
                    text={text}
                    y="60%"
                    x={Math.floor(elementWidth / 2 - (text.length * SINGLE_CHAR_WIDTH) / 2)}
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
