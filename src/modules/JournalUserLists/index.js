import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/GridLegacy';
import Paper from '@mui/material/Paper';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { loadLists, createList, updateList, deleteList } from 'actions/journalUserLists';
import { locale } from 'locale';
import { DataGrid } from './DataGrid';

const journalUserLists = () => {
    const dispatch = useDispatch();
    const txt = locale.pages.journalUserLists;
    const { loading, data, error } = useSelector(state => state.get('journalUserListsReducer'));
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    useEffect(() => {
        dispatch(loadLists()).finally(() => setHasLoadedOnce(true));
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
                                        createAction={createList}
                                        updateAction={updateList}
                                        deleteAction={deleteList}
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

export default React.memo(journalUserLists);
