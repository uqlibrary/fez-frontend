import React from 'react';
import { PropTypes } from 'prop-types';
import Highcharts from 'highcharts';

const Chart = ({ chartOptions, className }) => {
    const chartRef = React.useRef();
    const chart = React.useRef(null);

    /* istanbul ignore next */
    const reflowChart = () => chart.current?.reflow();
    React.useEffect(() => {
        chart.current = new Highcharts.Chart(chartRef.current, chartOptions);

        (window.matchMedia?.('print') || null)?.addEventListener('change', reflowChart);
        return () => {
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

export default React.memo(Chart);
