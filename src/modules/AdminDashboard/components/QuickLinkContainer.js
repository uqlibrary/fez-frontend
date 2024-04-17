import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import SectionTitle from './SectionTitle';
import QuickLink from './QuickLink';

const QuickLinkContainer = ({ locale }) => {
    const data = [
        { id: 150, title: '2021+ Imported Records with an Author ID and Research Subtypes Only', amount: 10 },
        { id: 1, title: '2021+ Imported Records with no Author ID with subtype exclusions', amount: 30 },
        { id: 2, title: '2016 - 2020 Imported Records with an Author ID and Research Subtypes Only', amount: 60 },
        { id: 3, title: '2016 - 2020 Imported Records with no Author ID with subtype exclusions', amount: 90 },
        { id: 4, title: 'Not yet publicly available (with merged metadata)', amount: 110 },
        { id: 5, title: 'Not yet publicly available (classic)', amount: 2345 },
    ];

    const onLinkClick = id => {
        console.log(id, 'click');
    };

    return (
        <Box paddingInlineStart={2} borderLeft={'1px solid rgba(224, 224, 224, 1)'}>
            <SectionTitle>
                {locale.title}
                <ExternalLink id={'add-quick-link'} data-testid={'add-quick-link'} href={'#'} openInNewIcon={false}>
                    <Typography
                        fontSize={'0.875rem'}
                        paddingInlineStart={1}
                        paddingInlineEnd={2}
                        textTransform={'none'}
                        variant="span"
                        display={'inline-block'}
                        fontWeight={200}
                    >
                        {locale.addLinkText}
                    </Typography>
                </ExternalLink>
            </SectionTitle>

            <Stack spacing={2} marginBlockStart={2}>
                {data.map(link => (
                    <QuickLink key={link.id} link={link} onLinkClick={onLinkClick} />
                ))}
            </Stack>
        </Box>
    );
};

QuickLinkContainer.propTypes = {
    locale: PropTypes.object.isRequired,
};

export default React.memo(QuickLinkContainer);
