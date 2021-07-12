import React from 'react';
import { useLocation } from 'react-router';
import deparam from 'can-deparam';

export const useJournalSearchQueryParams = () => {
    const location = useLocation();
    const [journalSearchQueryParams, setJournalSearchQueryParams] = React.useState(deparam(location.search.substr(1)));

    return {
        journalSearchQueryParams,
        setJournalSearchQueryParams,
        locationKey: location.key,
    };
};
