import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { locale } from 'locale';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert/index';
import { useSelector } from 'react-redux';
import { createList, deleteList, loadLists, updateList } from 'actions';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { DataGrid } from 'modules/JournalUserLists/DataGrid';
import { useDispatchOnce } from 'hooks/useDispatchOnce';

const JournalUserLists = () => {
    const txt = locale.pages.journalUserLists;
    const { loading, data, error, isDirty } = useSelector(
        // @ts-expect-error TODO fix once converted to TS
        /* istanbul ignore next */ state => state.get('journalUserListsReducer'),
    );
    const loaded = data || error;
    const fetch = useDispatchOnce(loaded && !isDirty, () => loadLists());

    useEffect(() => {
        fetch();
    }, [fetch]);

    if (loading && !loaded) {
        return <InlineLoader data-testid="journal-user-lists-loading" message={txt.loadingMessage} />;
    }

    return (
        <StandardPage title={locale.pages.journalUserLists.title}>
            <Grid container spacing={3}>
                {error && (
                    <Grid size={12}>
                        <Alert alertId="journal-user-lists-error" type="error" {...error} />
                    </Grid>
                )}
                <Grid size="grow">
                    <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                        <Grid flexGrow={1}>
                            <DataGrid
                                createAction={createList}
                                updateAction={updateList}
                                deleteAction={deleteList}
                                data={data}
                            />
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(JournalUserLists);
