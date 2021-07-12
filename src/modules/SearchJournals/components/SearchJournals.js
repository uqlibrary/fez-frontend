import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface, { useSelectedKeywords } from './JournalSearchInterface';
import JournalSearchResult from './JournalSearchResult';

import { useLocation } from 'react-router';

export const SearchJournals = ({}) => {
    const location = useLocation();
    const { selectedKeywords, setSelectedKeywords } = useSelectedKeywords();

    return (
        <StandardPage>
            <JournalSearchInterface
                key={location.key}
                onSearch={setSelectedKeywords}
                initialSelectedKeywords={selectedKeywords}
            />
            <JournalSearchResult />
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
