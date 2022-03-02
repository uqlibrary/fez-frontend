import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { JournalDetailsContext } from './JournalDataContext';
import Section from './Section';

import locale from 'locale/pages';
import { viewJournalConfig } from 'config/viewJournal';
import * as actions from 'actions';

export const ViewJournal = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const txt = locale.pages.journal.view;

    const journalLoading = useSelector(state => state.get('journalReducer').journalLoading);
    const journalDetails = useSelector(state => state.get('journalReducer').journalDetails);
    const journalLoadingError = useSelector(state => state.get('journalReducer').journalLoadingError);

    React.useEffect(() => {
        !!id && !journalDetails && dispatch(actions.loadJournal(id));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (journalLoading) {
        return <InlineLoader message={txt.loadingMessage} loaderId="journal-loading" />;
    }

    if (journalLoadingError) {
        return (
            <StandardPage>
                <Alert {...txt.loadFailureAlert} />
            </StandardPage>
        );
    }

    if (!journalDetails) {
        return <StandardPage />;
    }

    return (
        <StandardPage standarPageId="journal-view" title={journalDetails.jnl_title}>
            <JournalDetailsContext.Provider
                value={{
                    journalDetails,
                }}
            >
                <Grid container spacing={3}>
                    {Object.entries(viewJournalConfig)
                        // eslint-disable-next-line no-unused-vars
                        .filter(([_, sectionConfig]) => {
                            if (!!sectionConfig.key) {
                                return !!journalDetails[sectionConfig.key];
                            }
                            return true;
                        })
                        .map(([sectionKey, sectionConfig]) => (
                            <Section
                                key={`section-${sectionKey}`}
                                sectionKey={sectionKey}
                                sectionConfig={sectionConfig}
                            />
                        ))}
                </Grid>
            </JournalDetailsContext.Provider>
        </StandardPage>
    );
};

ViewJournal.propTypes = {};

export default React.memo(ViewJournal);
