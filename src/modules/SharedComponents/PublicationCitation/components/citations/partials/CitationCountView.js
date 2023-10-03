import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'helpers/withTheme';

import Box from '@mui/material/Box';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export class CitationCountView extends PureComponent {
    static propTypes = {
        source: PropTypes.string,
        count: PropTypes.any,
        link: PropTypes.string,
        title: PropTypes.string,
        theme: PropTypes.any,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { source, count, link, title, theme } = this.props;
        return (
            <React.Fragment>
                <ExternalLink
                    id="citation-count"
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
    }
}

export default withTheme()(CitationCountView);
