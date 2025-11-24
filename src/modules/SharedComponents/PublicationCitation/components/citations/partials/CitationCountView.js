import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const CitationCountView = ({ source, count, link, title }) => {
    const theme = useTheme();

    return (
        <React.Fragment>
            <ExternalLink
                id={`${source}-citation-count`}
                className={`${source}CitationCount`}
                sx={{ ...theme.typography.caption, marginRight: '8px' }}
                href={link}
                aria-label={title}
                title={title}
                openInNewIcon={false}
            >
                <span className={`fez-icon ${source} large`} />
                {count !== null && (
                    <Box component={'span'} sx={{ marginLeft: '0.4em' }}>
                        {count}
                    </Box>
                )}
            </ExternalLink>
        </React.Fragment>
    );
};

CitationCountView.propTypes = {
    source: PropTypes.string,
    count: PropTypes.any,
    link: PropTypes.string,
    title: PropTypes.string,
    theme: PropTypes.any,
};

export default React.memo(CitationCountView);
