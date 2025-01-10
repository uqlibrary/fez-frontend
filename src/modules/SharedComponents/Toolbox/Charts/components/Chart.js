import React from 'react';
import { PropTypes } from 'prop-types';
import Highcharts from 'highcharts';
import isEqual from 'lodash/isEqual';

const Chart = ({ chartOptions, className }) => {
    const chartRef = React.useRef();
    const chart = React.useRef(null);

    /* istanbul ignore next */
    const reflowChart = () => {
        console.log('call chart.current.reflow');
        if (!!chart && !!chart.current && !!chart.current.reflow) {
            try {
                chart?.current?.reflow();
            } catch (e) {
                console.log('Error in reflowing chart', e);
            }
        } else {
            console.log('chart is null');
        }
    };
    React.useEffect(() => {
        if (chartRef.current) {
            chart.current = new Highcharts.Chart(chartRef.current, chartOptions);
            console.log('set chart.current');
        }

        (window.matchMedia?.('print') || null)?.addEventListener('change', reflowChart);
        return () => {
            console.log('destroy chart');
            !!chart.current && (window.matchMedia?.('print') || null)?.removeEventListener('change', reflowChart);
            chart.current?.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        chart.current?.update(chartOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartOptions]);

    return <div className={className} ref={chartRef} />;
};

Chart.propTypes = {
    chartOptions: PropTypes.object.isRequired,
    className: PropTypes.string,
};

// export default React.memo(Chart);
export default React.memo(Chart, (prevProps, nextProps) => {
    return isEqual(prevProps.chartOptions, nextProps.chartOptions) && prevProps.className === nextProps.className;
});
