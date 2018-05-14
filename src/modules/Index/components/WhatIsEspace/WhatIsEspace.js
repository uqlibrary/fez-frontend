import React, {PureComponent} from 'react';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {default as locale} from 'locale/components';

class WhatIsEspace extends PureComponent {
    render() {
        const txt = locale.components.whatIsEspace;
        return (
            <StandardCard title={txt.title} className="whatIsEspace">
                {txt.text}
                {
                    txt.readMoreLink &&
                    <a href={txt.readMoreLink}>{txt.readMoreTitle}</a>
                }
            </StandardCard>
        );
    }
}
export default WhatIsEspace;
