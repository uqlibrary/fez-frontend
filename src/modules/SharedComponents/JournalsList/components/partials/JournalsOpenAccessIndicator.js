import React from 'react';
import PropTypes from 'prop-types';

import { green, orange, blue, deepOrange } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import AcceptedIcon from '@mui/icons-material/School';
import PublishedIcon from '@mui/icons-material/AutoStoriesOutlined';

import { status as oaStatus, types } from './utils';

const icons = { accepted: AcceptedIcon, published: PublishedIcon };

const JournalsOpenAccessIndicator = ({ type, status, label, embargoPeriod, tooltip, id, ...rest }) => {
    const Icon = icons[type];

    const classes = {
        [oaStatus.open]: {
            '& .iconColumn': {
                backgroundColor: green[800],
            },
            '& .labelColumn': {
                backgroundColor: green[50],
                color: green[800],
            },
        },
        [`${types.published}${oaStatus.open}`]: {
            '& .iconColumn': {
                backgroundColor: '#51247A',
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
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'rgba(255,255,255)',
            },
            '& .labelColumn': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: 'rgba(0,0,0,0.8)',
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
                        {!!embargoPeriod ? (
                            `${embargoPeriod}M`
                        ) : (
                            <Icon color="white" sx={{ width: 'auto', height: '18px' }} />
                        )}
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
    embargoPeriod: PropTypes.number,
    tooltip: PropTypes.string,
    label: PropTypes.string,
};

export default React.memo(JournalsOpenAccessIndicator);
