import React from 'react';

export const JournalDetailsContext = React.createContext({
    journalDetails: null,
});

export const useJournalDetailsContext = () => React.useContext(JournalDetailsContext);
