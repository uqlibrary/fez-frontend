import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';

const ChartBlock = ({ loading, success, hasData = true, height = 225, render, id }) => {
    if (loading) {
        return <Skeleton animation="wave" height={height} width="100%" data-testid={`${id}-chart-skeleton`} />;
    }

    if (!success || !hasData) return null;

    return render();
};

ChartBlock.propTypes = {
    id: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    success: PropTypes.bool,
    hasData: PropTypes.bool,
    height: PropTypes.number,
};

export default React.memo(ChartBlock);
