import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { stringToColour, abbreviateNumber } from '../utils';

const QuickLink = ({ link, onLinkClick, ...rest }) => {
    return (
        <Card {...rest}>
            <CardActionArea onClick={() => onLinkClick(link)}>
                <CardHeader
                    avatar={
                        <Box
                            sx={{
                                bgcolor: stringToColour(link.title),
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                padding: 1,
                                borderRadius: 2,
                                color: 'white !important',
                                textShadow: '0px 0px 2px rgba(0,0,0,0.87)',
                            }}
                            aria-label="count"
                        >
                            {abbreviateNumber(link.amount, 1)}
                        </Box>
                    }
                    title={link.title}
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    sx={{ padding: 1 }}
                />
            </CardActionArea>
        </Card>
    );
};

QuickLink.propTypes = {
    link: PropTypes.shape({
        title: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
    }),
    onLinkClick: PropTypes.func.isRequired,
};

export default React.memo(QuickLink);
