import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import { sanitiseId } from 'helpers/general';

const codeStyles = {
    asic: {
        backgroundColor: 'error.main',
        color: 'white.main',
    },
    abdc: {
        backgroundColor: 'accent.main',
        color: 'white.main',
    },
    era: {
        backgroundColor: 'success.main',
        color: 'white.main',
    },
    wosssci: {
        backgroundColor: 'primary.dark',
        color: 'white.main',
    },
    wosscie: {
        backgroundColor: 'primary.dark',
        color: 'white.main',
    },
    wosesci: {
        backgroundColor: 'primary.dark',
        color: 'white.main',
    },
    citescore: {
        backgroundColor: 'accent.main',
        color: 'white.main',
    },
};

export const ForCodeSource = ({ source, index }) => {
    const id = sanitiseId(`journal-search-item-subject-source-${source}-${index}`);
    return (
        <Typography
            variant="caption"
            component="span"
            sx={{
                textTransform: 'uppercase',
                padding: '3px',
                fontSize: '10px',
                marginLeft: '5px',
                ...codeStyles[source],
            }}
            id={id}
            data-testid={id}
            noWrap
        >
            {source}
        </Typography>
    );
};

ForCodeSource.propTypes = {
    source: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(ForCodeSource);
