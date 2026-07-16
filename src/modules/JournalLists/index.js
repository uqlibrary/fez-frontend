import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/GridLegacy';
import Paper from '@mui/material/Paper';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import {
    loadJournalLists as loadAction,
    createJournalList as createAction,
    updateJournalList as updateAction,
    deleteJournalList as deleteAction,
} from '../../actions';
import { locale } from 'locale';
import { DataGrid } from './DataGrid';

export const JournalLists = () => {
    const dispatch = useDispatch();
    const txt = locale.pages.journalLists;
    const { loading, data, error } = useSelector(state => state.get('journalListsReducer'));
    const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);

    React.useEffect(() => {
        dispatch(loadAction()).finally(() => setHasLoadedOnce(true));
    }, []);

    if (loading && !hasLoadedOnce) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    return (
        <StandardPage title={txt.title}>
            {!!data && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div style={{ width: '100%' }}>
                            <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ flexGrow: 1 }}>
                                    <DataGrid
                                        createAction={createAction}
                                        updateAction={updateAction}
                                        deleteAction={deleteAction}
                                        data={data}
                                        error={error}
                                    />
                                </div>
                            </Paper>
                        </div>
                    </Grid>
                </Grid>
            )}
        </StandardPage>
    );
};

export default React.memo(JournalLists);
