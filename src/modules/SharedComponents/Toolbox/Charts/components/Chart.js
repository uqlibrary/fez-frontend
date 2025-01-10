import React from 'react';
import { PropTypes } from 'prop-types';
import Highcharts from 'highcharts';
import isEqual from 'lodash/isEqual';

const Chart = ({ chartOptions, className }) => {
    const chartRef = React.useRef();
    const chart = React.useRef(null);

    React.useEffect(() => {
        if (chartRef.current) {
            chart.current = new Highcharts.Chart(chartRef.current, chartOptions);
        }

        return () => {
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
