import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const category = 'series';
const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = (state.get('searchKeysReducer') &&
        state.get('searchKeysReducer')[category]) || { itemsList: [], itemsLoading: false };
    return {
        allowFreeText: true,
        defaultValue: (!!props.input && !!props.input.value && { value: props.input.value }) || null,
        errorText: props.meta ? props.meta.error : null,
        error: !!props.meta && !!props.meta.error,
        filterOptions: options => options,
        getOptionLabel: item => (!!item && String(item.value)) || '',
        itemsList,
        itemsLoading,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery)),
    onChange: item => props.input.onChange(item.value),
    onClear: () => props.input.onChange(null),
});

export const SeriesField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsynchronousField);
