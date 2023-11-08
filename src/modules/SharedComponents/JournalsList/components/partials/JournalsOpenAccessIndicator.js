import React from 'react';
import PropTypes from 'prop-types';

import { green, orange, blue } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import AcceptedIcon from '@mui/icons-material/School';
import PublishedIcon from '@mui/icons-material/AutoStoriesOutlined';

import { status as oaStatus } from './utils';

const icons = { accepted: AcceptedIcon, published: PublishedIcon };

const JournalsOpenAccessIndicator = ({ type, status, label, tooltip, ...rest }) => {
    const Icon = icons[type];

    const classes = {
        [oaStatus.open]: {
            '& .iconColumn': {
                backgroundColor: green[500],
            },
            '& .labelColumn': {
                backgroundColor: 'rgba(76,175,80,0.05)',
                color: green[500],
            },
        },
        [oaStatus.cap]: {
            '& .iconColumn': {
                backgroundColor: blue[500],
            },
            '& .labelColumn': {
                backgroundColor: 'rgba(33,150,243,0.05)',
                color: blue[500],
            },
        },
        [oaStatus.embargo]: {
            '& .iconColumn': {
                backgroundColor: 'rgba(0,0,0,0.8)',
            },
            '& .labelColumn': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: 'rgba(0,0,0,0.8)',
            },
        },
        [oaStatus.fee]: {
            '& .iconColumn': {
                backgroundColor: orange[500],
            },
            '& .labelColumn': {
                backgroundColor: 'rgba(255,152,0,0.05)',
                color: orange[500],
            },
        },
    };
    return (
        <Tooltip
            title={tooltip}
            placement="left"
            key={`tooltip-${type}-${status}`}
            disableFocusListener={!!!tooltip}
            disableHoverListener={!!!tooltip}
            disableTouchListener={!!!tooltip}
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
                    ...classes[status],
                }}
                className={`openAccessIndicator ${rest.id ?? ''}-${type} ${status}`}
                {...rest}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '26px auto',
                        gridTemplateRows: 'auto',
                        gridTemplateAreas: '"icon label"',
                    }}
                    className="wrapper"
                >
                    <Box
                        sx={{
                            gridArea: 'icon',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        className="iconColumn"
                    >
                        <Icon color="white" sx={{ width: 'auto', height: '18px' }} />
                    </Box>
                    <Box
                        sx={{
                            gridArea: 'label',
                            fontSize: '12px',
                            fontWeight: 400,
                            padding: '4px 8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textTransform: 'uppercase',
                        }}
                        className="labelColumn"
                    >
                        {label ?? status}
                    </Box>
                </Box>
            </Box>
        </Tooltip>
    );
};

JournalsOpenAccessIndicator.propTypes = {
    type: PropTypes.oneOf(['accepted', 'published']).isRequired,
    status: PropTypes.oneOf(['open', 'cap', 'embargo', 'fee']).isRequired,
    tooltip: PropTypes.string,
    label: PropTypes.string,
};

export default React.memo(JournalsOpenAccessIndicator);
