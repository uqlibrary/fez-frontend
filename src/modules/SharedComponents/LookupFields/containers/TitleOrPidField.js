import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { matchSorter } from 'match-sorter';
import { TitleOrPidOptionTemplate } from 'modules/SharedComponents/LookupFields';

const category = 'publication';
const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = (state.get('searchKeysReducer') &&
        state.get('searchKeysReducer').publication) || {
        itemsList: [],
        itemsLoading: false,
    };
    return {
        autoCompleteAsynchronousFieldId: props.titleOrPidFieldId || 'rek-isdatasetof',
        itemsList: itemsList.map(item => ({ id: item.rek_pid, value: item.rek_title, ...item })),
        itemsLoading,
        getOptionLabel: item => (!!item.rek_title ? '' : item),
        filterOptions: (options, { inputValue }) =>
            matchSorter(options, inputValue, { keys: ['rek_pid', 'rek_title'] }),
        OptionTemplate: TitleOrPidOptionTemplate,
        defaultValue:
            (!!props.input.value && (props.input.value.toJS ? props.input.value.toJS() : props.input.value)) || null,
        error: !!props.meta && !!props.meta.error,
        errorText: (!!props.meta && props.meta.error) || null,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadPublicationList(category, searchQuery)),
    onChange: item => props.input.onChange(item),
    onClear: () => props.input.onChange(null),
});

export const TitleOrPidField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
