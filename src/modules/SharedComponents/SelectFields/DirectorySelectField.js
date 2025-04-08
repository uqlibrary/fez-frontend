import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

export default function DirectorySelectField(fieldProps) {
    const dispatch = useDispatch();
    const itemsList = useSelector(
        state =>
            !!state.get('batchImportDirectoriesReducer') &&
            state.get('batchImportDirectoriesReducer').batchImportDirectoryList.map(item => {
                return { text: item, value: item };
            }),
    );
    const itemsLoading = useSelector(
        state =>
            !!state.get('batchImportDirectoriesReducer') &&
            state.get('batchImportDirectoriesReducer').batchImportDirectoryLoading,
    );

    React.useEffect(() => {
        dispatch(actions.getBatchImportDirectories());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NewGenericSelectField
            disabled={itemsLoading || fieldProps.disabled}
            displayEmpty={itemsLoading} // display loading prompt while items are loading
            error={!!fieldProps.state?.error}
            errorText={fieldProps.state?.error}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            value={fieldProps.value || ''}
            {...fieldProps}
        />
    );
}
