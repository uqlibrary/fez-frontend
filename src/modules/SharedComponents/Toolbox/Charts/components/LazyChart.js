import React from 'react';
import PropTypes from 'prop-types';
import LazyLoadSuspense from 'modules/SharedComponents/LazyLoadSuspense';

// Lazy load the Chart component
const Chart = React.lazy(() => import('./Chart'));

const LazyChart = props => {
    return (
        <LazyLoadSuspense minHeight="320px">
            <Chart {...props} />
        </LazyLoadSuspense>
    );
};

LazyChart.propTypes = {
    chartOptions: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default LazyChart;
