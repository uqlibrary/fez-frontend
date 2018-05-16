import React, {PureComponent} from 'react';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {locale} from 'locale';

export default class WhatIsEspace extends PureComponent {
    render() {
        const txt = locale.components.whatIsEspace;
        return (
            <StandardCard title={txt.title} className="whatIsEspace primaryHeader">
                {txt.text}
                <ExternalLink href={txt.readMoreLink} title={txt.readMoreTitle} aria-label={txt.readMoreTitle}
                    target={'_self'} openInNewIcon={false}>
                    {txt.readMoreLabel}
                </ExternalLink>
            </StandardCard>
        );
    }
}
