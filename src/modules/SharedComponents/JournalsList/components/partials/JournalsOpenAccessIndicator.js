import React from 'react';
import PropTypes from 'prop-types';

import { green, orange, blue, grey, deepOrange } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import AcceptedIcon from '@mui/icons-material/School';
import PublishedIcon from '@mui/icons-material/AutoStoriesOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';

import { status as oaStatus, types } from './utils';

const getIconColumnStyle = (showDiamond, showS2O) => {
    if (showS2O) return { backgroundColor: '#000000', color: orange[800] };
    if (showDiamond) return { backgroundColor: grey[800] };
    return { backgroundColor: '#51247A' };
};

const JournalsOpenAccessIndicator = ({
    type,
    status,
    showDiamond,
    showS2O,
    label,
    embargoPeriod,
    tooltip,
    id,
    ...rest
}) => {
    const icons = {
        accepted: AcceptedIcon,
        published: showDiamond ? DiamondIcon : PublishedIcon,
    };

    const Icon = icons[type];

    const classes = {
        [oaStatus.open]: {
            '& .iconColumn': {
                backgroundColor: 'rgba(0,0,0,0.8)',
            },
            '& .labelColumn': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: 'rgba(0,0,0,0.8)',
            },
        },
        [`${types.published}${oaStatus.open}`]: {
            '& .iconColumn': {
                ...getIconColumnStyle(showDiamond, showS2O),
            },
            '& .labelColumn': {
                backgroundColor: '#EDE4F7',
                color: '#51247A',
            },
        },
        [oaStatus.cap]: {
            '& .iconColumn': {
                backgroundColor: blue[800],
            },
            '& .labelColumn': {
                backgroundColor: blue[50],
                color: blue[800],
            },
        },
        [oaStatus.embargo]: {
            '& .iconColumn': {
                backgroundColor: green[800],
                color: 'rgba(255,255,255)',
            },
            '& .labelColumn': {
                backgroundColor: green[50],
                color: green[800],
            },
        },
        [oaStatus.fee]: {
            '& .iconColumn': {
                backgroundColor: orange[800],
            },
            '& .labelColumn': {
                backgroundColor: orange[50],
                color: deepOrange[900],
            },
        },
    };

    const columnStyle = {
        fontSize: '12px',
        fontWeight: 400,
        padding: '4px 8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'uppercase',
        lineHeight: 1.5,
    };

    const getIcon = () => {
        if (showS2O) return 'S2O';
        if (embargoPeriod) return `${embargoPeriod}M`;
        return <Icon color="white" sx={{ width: 'auto', height: '18px' }} />;
    };

    return (
        <Tooltip
            title={tooltip}
            placement="left"
            key={`tooltip-${type}-${status}`}
            disableFocusListener={!!!tooltip}
            disableHoverListener={!!!tooltip}
            disableTouchListener={!!!tooltip}
            id={`open-access-${id}`}
            data-testid={`open-access-${id}`}
        >
            <Box
                sx={{
                    display: 'inline-flex',
                    flex: '1 1 auto',
                    maxWidth: '100px',
                    minWidth: 0,
                    '&:first-of-type': {
                        marginRight: '4px',
                    },
                    ...(type === types.published && status === oaStatus.open
                        ? classes[`${types.published}${oaStatus.open}`]
                        : classes[status]),
                }}
                className={`openAccessIndicator ${type} ${status}`}
                {...rest}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '28px auto',
                        gridTemplateRows: 'auto',
                        gridTemplateAreas: '"icon label"',
                    }}
                    className="wrapper"
                >
                    <Box sx={{ gridArea: 'icon', ...columnStyle }} className="iconColumn">
                        {getIcon()}
                    </Box>
                    <Box sx={{ gridArea: 'label', ...columnStyle }} className="labelColumn">
                        {label ?? status}
                    </Box>
                </Box>
            </Box>
        </Tooltip>
    );
};

JournalsOpenAccessIndicator.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['accepted', 'published']).isRequired,
    status: PropTypes.oneOf(['open', 'cap', 'embargo', 'fee']).isRequired,
    showDiamond: PropTypes.bool,
    showS2O: PropTypes.bool,
    embargoPeriod: PropTypes.number,
    tooltip: PropTypes.string,
    label: PropTypes.string,
};

export default React.memo(JournalsOpenAccessIndicator);
