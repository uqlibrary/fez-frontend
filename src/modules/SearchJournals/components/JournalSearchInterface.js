import React from 'react';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';
import JournalSearchInput from './JournalSearchInput';
import SelectedKeywords from './SelectedKeywords';
import KeywordsBrowser from './KeywordsBrowser';

import locale from 'locale/components';

const getKeywordKey = keyword => `${keyword.type}-${keyword.text.replace(/ /g, '-')}`;

export const JournalSearchInterface = () => {
    const txt = locale.components.journalSearch;
    const [selectedKeywords, setSelectedKeywords] = React.useState(null);

    const handleKeywordAdd = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => ({
                ...prevSelectedKeywords,
                [getKeywordKey(keyword)]: { ...keyword, id: getKeywordKey(keyword) },
            })),
        [],
    );

    const handleKeywordDelete = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => {
                // eslint-disable-next-line no-unused-vars
                const { [keyword.id]: keywordToDelete, ...rest } = prevSelectedKeywords;
                return { ...rest };
            }),
        [],
    );

    return (
        <StandardCard title={txt.journalSearchInterface.title}>
            <Grid container>
                <Grid item xs={12}>
                    <JournalSearchInput />
                </Grid>
                <Grid item xs={12}>
                    <SelectedKeywords onKeywordDelete={handleKeywordDelete} keywords={selectedKeywords || []} />
                </Grid>
                <Grid item xs={12}>
                    <KeywordsBrowser onKeywordAdd={handleKeywordAdd} />
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(JournalSearchInterface);
