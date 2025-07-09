/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import * as actions from 'actions';
import { matchSorter } from 'match-sorter';

const category = 'report_number';

export const ReportNumberField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer')[category],
    ) || { itemsList: [], itemsLoading: false };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            loadSuggestions={loadSuggestions}
            autoCompleteAsynchronousFieldId={props.reportNumberFieldId || 'rek-report-number'}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            allowFreeText
            errorText={props.meta ? props.meta.error : null}
            error={props.meta ? !!props.meta.error : null}
            getOptionLabel={item => (!!item && String(item.value)) || ''}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] })}
            onChange={item => props.input.onChange(item.value)}
            onClear={() => props.input.onChange(null)}
        />
    );
};

ReportNumberField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(ReportNumberField);
