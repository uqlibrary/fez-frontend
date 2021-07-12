import React from 'react';

export const JournalSearchResult = () => {
    return `JournalSearchResult: ${Math.floor(Math.random() * 100)}`;
};

export default React.memo(JournalSearchResult);
