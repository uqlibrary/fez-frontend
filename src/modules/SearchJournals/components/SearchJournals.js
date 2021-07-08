import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';

export const SearchJournals = ({}) => {
    return (
        <StandardPage>
            <JournalSearchInterface />
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
