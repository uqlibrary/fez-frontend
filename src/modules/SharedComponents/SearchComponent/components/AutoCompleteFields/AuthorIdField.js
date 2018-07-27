import React from 'react';
import {AdvancedSearchAutoComplete} from '../AdvancedSearchAutoComplete';
import {connect} from 'react-redux';
import * as actions from 'actions';
import MenuItem from 'material-ui/MenuItem';

const mapStateToProps = (state, props) => {
    const category = 'author';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList
                .map(item => {
                    return {
                        id: item.id,
                        text: `${item.id} (${item.value})`,
                        value: (
                            <MenuItem
                                primaryText={item.value}
                                secondaryText={item.id}
                            />
                        )
                    };
                })
            : [],
        onChange: (value) => {
            props.onChange({}, value.id, value.text);
        },
        async: true,
        errorText: props.errorText,
        selectedValue: !!props.label && props.label || !!props.value && props.value || '',
        filter: (searchText, key, item) => {
            return item.id !== 0;
        }
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const AuthorIdField = connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchAutoComplete);

