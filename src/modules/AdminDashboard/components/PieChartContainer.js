import React from 'react';
import PropTypes from 'prop-types';

import SectionTitle from './SectionTitle';

const PieChartContainer = ({ label, subtext, children, id }) => {
    return (
        <React.Fragment>
            <SectionTitle sx={{ textAlign: 'center' }} data-testid={`${id}-title`}>
                {label}
            </SectionTitle>
            {subtext && (
                <SectionTitle sx={{ textAlign: 'center', textTransform: 'none' }} data-testid={`${id}-subtitle`}>
                    {subtext}
                </SectionTitle>
            )}
            {children}
        </React.Fragment>
    );
};

PieChartContainer.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    subtext: PropTypes.any,
};

export default React.memo(PieChartContainer);
