import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { loadLists, createList, updateList, deleteList } from 'actions/journalUserLists';
import { locale } from 'locale';
import { DataGrid } from './DataGrid';

const Manager = () => {
    const dispatch = useDispatch();
    const txt = locale.pages.journalUserLists;

    const { loading, data, error } = useSelector(
        // @ts-expect-error TODO fix once converted to TS
        /* istanbul ignore next */ state => state.get('journalUserListsReducer'),
    );
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    useEffect(() => {
        dispatch(loadLists()).finally(() => setHasLoadedOnce(true));
    }, []);

    if (loading && !hasLoadedOnce) {
        return <InlineLoader data-testid="journal-user-lists-loading" message={txt.loadingMessage} />;
    }

    return (
        <DataGrid
            createAction={createList}
            updateAction={updateList}
            deleteAction={deleteList}
            data={data}
            error={error}
        />
    );
};

export default React.memo(Manager);
