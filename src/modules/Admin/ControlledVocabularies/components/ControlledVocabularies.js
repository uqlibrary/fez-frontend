import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import pageLocale from 'locale/pages';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ControlledVocabularies = () => {
    const txt = pageLocale.pages.controlledVocabularies;

    return (
        <StandardPage title={txt.title}>
            <StandardCard>Hello</StandardCard>
        </StandardPage>
    );
};

export default React.memo(ControlledVocabularies);
