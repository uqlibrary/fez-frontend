import React from 'react';
import {AutoSuggestField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
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
        onChange: props.onChange,
        allowFreeText: true,
        async: true,
        errorText: props.errorText,
        selectedValue: !!props.label && {value: props.label} || !!props.value && {value: props.value} || '',
        filter: (searchText, key, item) => {
            return !!item.id && item.id !== 0;
        }
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const AuthorIdField = connect(mapStateToProps, mapDispatchToProps)(AutoSuggestField);

