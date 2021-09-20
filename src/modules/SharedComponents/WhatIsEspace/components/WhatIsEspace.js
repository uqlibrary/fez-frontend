import React, { PureComponent } from 'react';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import { locale } from 'locale';

export default class WhatIsEspace extends PureComponent {
    render() {
        const txt = locale.components.whatIsEspace;
        return (
            <StandardCard title={txt.title} primaryHeader>
                <Typography variant={'body2'}>
                    {txt.text}
                    {txt.readMoreLink.indexOf('http') === -1 && <Link to={txt.readMoreLink}>{txt.readMoreLabel}</Link>}
                    {txt.readMoreLink.indexOf('http') >= 0 && (
                        <ExternalLink
                            id="what-is-espace-read-more"
                            href={txt.readMoreLink}
                            title={txt.readMoreTitle}
                            aria-label={txt.readMoreTitle}
                        >
                            {txt.readMoreLabel}
                        </ExternalLink>
                    )}
                </Typography>
            </StandardCard>
        );
    }
}
