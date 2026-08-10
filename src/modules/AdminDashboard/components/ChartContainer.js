import React from 'react';
import PropTypes from 'prop-types';

import SectionTitle from './SectionTitle';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Typography from '@mui/material/Typography';

const ChartContainer = ({ label, subtext, tooltip, children, id }) => {
    const isStringSubtext = typeof subtext === 'string';

    return (
        <React.Fragment>
            <SectionTitle sx={{ textAlign: 'center' }} data-testid={`${id}-title`}>
                {label}
            </SectionTitle>
            {subtext && (
                <SectionTitle sx={{ textAlign: 'center', textTransform: 'none' }} data-testid={`${id}-subtitle`}>
                    {isStringSubtext ? (
                        <Typography variant="span" sx={{ fontSize: '0.875rem', fontWeight: 200 }}>
                            {subtext}
                        </Typography>
                    ) : (
                        subtext
                    )}

                    {tooltip && (
                        <Tooltip title={tooltip} arrow>
                            <HelpIcon fontSize="small" />
                        </Tooltip>
                    )}
                </SectionTitle>
            )}
            {children}
        </React.Fragment>
    );
};

ChartContainer.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    subtext: PropTypes.any,
    tooltip: PropTypes.string,
};

export default React.memo(ChartContainer);
