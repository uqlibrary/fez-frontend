import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import JournalSearchInput from './JournalSearchInput';
import SelectedKeywords from './SelectedKeywords';
import KeywordsBrowser from './KeywordsBrowser';

import locale from 'locale/components';
import { pathConfig } from 'config/pathConfig';

const getKeywordKey = keyword => `${keyword.type}-${keyword.text.replace(/ /g, '-')}`;

export const JournalSearchInterface = () => {
    const theme = useTheme();
    const txt = locale.components.journalSearch;
    const [selectedKeywords, setSelectedKeywords] = React.useState({});
    const hasAnySelectedKeywords = Object.values(selectedKeywords).length > 0;

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
                const newSelectedKeywords = { ...prevSelectedKeywords };
                delete newSelectedKeywords[keyword.id];
                return { ...newSelectedKeywords };
            }),
        [],
    );

    const handleFavouriteJournalsClick = React.useCallback(() => history.push(pathConfig.journal.favourite), []);

    const handleBrowseAllJournalsClick = React.useCallback(() => history.push(pathConfig.journal.browseAll), []);

    const handleSearchJournalsClick = React.useCallback(() => history.push(pathConfig.journal.result), []);

    return (
        <StandardCard
            customTitleColor={theme.palette.primary.main}
            title={txt.journalSearchInterface.title}
            style={{ padding: 16 }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <JournalSearchInput />
                </Grid>
                {hasAnySelectedKeywords && (
                    <Grid item xs={12}>
                        <SelectedKeywords
                            onKeywordDelete={handleKeywordDelete}
                            keywords={Object.values(selectedKeywords)}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <KeywordsBrowser onKeywordAdd={handleKeywordAdd} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item xs={12} sm="auto">
                            <Button
                                children={txt.journalSearchInterface.buttons.myFavouriteJournals.title}
                                aria-label={txt.journalSearchInterface.buttons.myFavouriteJournals.aria}
                                onClick={handleFavouriteJournalsClick}
                                id="my-favourite-journals-button"
                                data-testid="my-favourite-journals-button"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                id="browse-all-journals-button"
                                data-testid="browse-all-journals-button"
                                children={txt.journalSearchInterface.buttons.browseAllJournals.title}
                                aria-label={txt.journalSearchInterface.buttons.browseAllJournals.aria}
                                onClick={handleBrowseAllJournalsClick}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <Button
                                variant="contained"
                                children={txt.journalSearchInterface.buttons.searchJournals.title}
                                aria-label={txt.journalSearchInterface.buttons.searchJournals.aria}
                                type="submit"
                                color="primary"
                                onClick={handleSearchJournalsClick}
                                id="search-journals-button"
                                data-testid="search-journals-button"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(JournalSearchInterface);
