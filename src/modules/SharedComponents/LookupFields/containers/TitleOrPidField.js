/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';
import { matchSorter } from 'match-sorter';
import { TitleOrPidOptionTemplate } from 'modules/SharedComponents/LookupFields';

const category = 'publication';

export const TitleOrPidField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadPublicationList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer').publication,
    ) || {
        itemsList: [],
        itemsLoading: false,
    };
    return (
        <AutoCompleteAsynchronousField
            {...props}
            loadSuggestions={loadSuggestions}
            autoCompleteAsynchronousFieldId={props.titleOrPidFieldId || 'rek-isdatasetof'}
            itemsList={itemsList.map(item => ({ id: item.rek_pid, value: item.rek_title, ...item }))}
            itemsLoading={itemsLoading}
            getOptionLabel={item => (!!item.rek_title ? '' : item)}
            filterOptions={(options, { inputValue }) =>
                matchSorter(options, inputValue, { keys: ['rek_pid', 'rek_title'] })
            }
            OptionTemplate={TitleOrPidOptionTemplate}
            defaultValue={props?.value || null}
            error={!!props.state && !!props.state.error}
            errorText={(!!props.state && props.state.error) || null}
            onClear={() => props.onChange(null)}
        />
    );
};

TitleOrPidField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(TitleOrPidField);
