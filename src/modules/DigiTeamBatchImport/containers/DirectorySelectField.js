import React from 'react';
import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const translatedItemList =
        state.get('batchImportDirectoriesReducer') &&
        state
            .get('batchImportDirectoriesReducer')
            .batchImportDirectoryList.map((item, index) => ({ text: item, value: item, index: index + 1 }));
    return {
        label: (props.locale && props.locale.label) || props.label || '',
        selectedValue: props.input.value || [],
        itemsList: translatedItemList || [],
        batchImportDirectoryLoading:
            (state.get('batchImportDirectoriesReducer') &&
                state.get('batchImportDirectoriesReducer').batchImportDirectoryLoading) ||
            false,
        batchImportDirectoryLoadingError:
            (state.get('batchImportDirectoriesReducer') &&
                state.get('batchImportDirectoriesReducer').batchImportDirectoryLoadingError) ||
            false,
        batchImportDirectoryLoadingHint: props.loadingHint || 'Loading..',
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadItemsList: () => dispatch(actions.getBatchImportDirectories()),
    };
}

const DirectoryList = connect(
    mapStateToProps,
    mapDispatchToProps
)(GenericSelectField);

export default function DirectorySelectField(fieldProps) {
    return (
        <DirectoryList
            onChange={
                (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange)
            }
            {...fieldProps}
        />
    );
}
