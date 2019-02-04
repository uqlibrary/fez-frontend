import {AutoCompleteAsyncField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    return {
        itemsList: state.get('authorsReducer') && state.get('authorsReducer')
            ? state.get('authorsReducer').authorsList
                .filter(item => !!item.aut_org_username)
                .map(item => ({
                    value: `${item.aut_title} ${item.aut_display_name} ${item.aut_org_username ? `(${item.aut_org_username})` : ''} ${item.aut_student_username ? `(${item.aut_student_username})` : ''}`,
                    id: item.aut_id,
                    ...item
                }))
            : [],
        onChange: props.onChange,
        allowFreeText: false,
        async: true,
        selectedValue: !!props.value && {value: props.value} || '',
        itemToString: () => '',
        maxResults: 7,
        floatingLabelText: props.floatingLabelText || 'UQ Identifier',
        hintText: props.hintText || 'Enter a value to search',
    };
};

const mapDispatchToProps = (dispatch) => ({
    loadSuggestions: (searchKey, searchQuery = '') => dispatch(actions.searchAuthors(searchQuery))
});

export const UqIdField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

